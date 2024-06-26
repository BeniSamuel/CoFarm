// src/Components/ChatMessage/ChatMessage.js

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { ChatContext } from '../../Context/ChatContext';
import button from '../../assets/chat-button.png';

const socket = io('http://localhost:4040');

const ChatMessage = () => {
  const { currentUser, messages, setMessages } = useContext(ChatContext);
  const [message, setMessage] = useState("");
  const currentUserId = "loggedInUserId"; 

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser)
      axios.get(`http://localhost:4040/messages/${currentUser._id}`)
        .then(response => {
          console.log(response)
          setMessages(response.data);
        })
        .catch(error => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on('receiveMessage', message => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleClick = () => {
    axios.post("http://localhost:4040/messages", {
      senderId: currentUserId,
      receiverId: currentUser._id,
      message: message
    }).then(response => {
      socket.emit('sendMessage', response.data);
      setMessage("");
    }).catch(error => {
      console.error("Error sending message:", error);
    });
  };

  return (
    <div className='w-3/6'>
      <div>Chat</div>
      <div className='relative top-[31rem] flex flex-row'>
        <input
          type="text"
          placeholder='Type a message...'
          className='bg-[#83DF75] h-14 w-[36rem] relative left-7 placeholder-black pl-5 rounded-xl border-4 border-[#184B05]'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <img
          src={button}
          className='absolute top-3 left-[35rem] h-7 w-7'
          alt="Send"
          onClick={handleClick}
        />
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 m-2 ${msg.senderId === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessage;
