import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const ChatContext = createContext();

const socket = io("http://localhost:4040");

const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <ChatContext.Provider value={{ currentUser, setCurrentUser, messages, setMessages, socket }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;