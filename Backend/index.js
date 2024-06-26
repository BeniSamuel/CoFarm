const express=require("express");
const mongoose= require("mongoose");
const config=require("./config/config");
const routes=require("./routes/register");
const bodyParser=require("body-parser")
const login=require("./routes/login")
const user=require("./routes/user");
const cors=require("cors");
const messageRoutes = require('./routes/message');
const socket=require("socket.io");
const http=require("http");

const app=express();
const server= http.createServer(app);



mongoose.connect("mongodb://localhost/farmers")
.then(()=>console.log("connection made succesfully!"))
.catch((error)=>console.log("failed due to",error));

//middleware

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//routes available in application
app.use("/register",routes);
app.use("/login",login);
app.use("/users",user);
app.use('/messages', messageRoutes);


// socket functionality
const io = socket(server);
io.on('connection', socket => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  socket.on('sendMessage', message => {
    io.emit('receiveMessage', message);
  });
});


//port and server configuration
const port=config.port;
server.listen(port,()=>{
    console.log(`app is running at port ${port}`);
})


