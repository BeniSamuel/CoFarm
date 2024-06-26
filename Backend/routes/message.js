const express = require('express');
const router = express.Router();
const Message = require('../models/message');  // Assuming the model is in 'models/message.js'

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a new message
router.post('/', async (req, res) => {
  const message = new Message({
    message: req.body.message,
  });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
