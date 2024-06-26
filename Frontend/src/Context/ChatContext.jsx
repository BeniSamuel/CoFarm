// src/Context/ChatContext.js

import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider value={{ currentUser, setCurrentUser, messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
