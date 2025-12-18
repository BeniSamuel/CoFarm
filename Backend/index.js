require("dotenv").config()
// index.js or your main route file
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config.config");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");

const registerRoutes = require("./routes/register.router");
const loginRoutes = require("./routes/login.router");
const userRoutes = require("./routes/user.router");
const messageRoutes = require("./routes/message.router");
const groupRoutes = require("./routes/group.router");
const farmRoutes = require("./routes/farm.router");
const Message = require("./models/message.model");
const GroupMessage = require("./models/groupMessage.model");
const path = require("path");

const app = express();
const server = http.createServer(app);
const dbUrl = process.env.ATLAS_URL;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB connection failed:", error));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1/auth/register", registerRoutes);
app.use("/api/v1/auth/login", loginRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/farms", farmRoutes);

// Socket.io Setup
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join a room for private messaging
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Join a group room
  socket.on("joinGroupRoom", (groupId) => {
    socket.join(`group-${groupId}`);
    console.log(`User ${socket.id} joined group room: ${groupId}`);
  });

  // Handle sending private messages
  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      // Save message to database
      const newMessage = new Message({ senderId, receiverId, message });
      const savedMessage = await newMessage.save();
      console.log("Message saved:", savedMessage);

      // Send message to the receiver's room
      io.to(receiverId).emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle sending group messages
  socket.on("sendGroupMessage", async (data) => {
    try {
      const { groupId, senderId, message } = data;

      // Save group message to database
      const newGroupMessage = new GroupMessage({
        groupId,
        senderId,
        message,
      });
      const savedMessage = await newGroupMessage.save();
      await savedMessage.populate("senderId", "name email");
      console.log("Group message saved:", savedMessage);

      // Send message to all members in the group room
      io.to(`group-${groupId}`).emit("receiveGroupMessage", savedMessage);
    } catch (error) {
      console.error("Error saving group message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
const port = config.port || 4040;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
