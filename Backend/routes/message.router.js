const express = require("express");
const router = express.Router();
const Message = require("../models/message.model");

// Get messages between two users
router.get("/:senderId/:receiverId", async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.senderId, receiverId: req.params.receiverId },
        { senderId: req.params.receiverId, receiverId: req.params.senderId },
      ],
    }).sort({ createdAt: 1 });
    // console.log(messages);

    // Return empty array if no messages instead of 404
    res.json(messages || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

// Send a message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    // console.log(body);
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newMessage = new Message({ senderId, receiverId, message });
    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

module.exports = router;
