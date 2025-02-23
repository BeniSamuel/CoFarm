import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const ChatContext = createContext();

const socket = io("http://localhost:4040", { autoConnect: false }); // Disable auto-connect

const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loggedUser, setLoggedUser] = useState({});

  useEffect(() => {
    socket.connect(); // Connect only once
    console.log("Socket connected"); // Debugging

    return () => {
      socket.disconnect(); // Disconnect on unmount
      console.log("Socket disconnected"); // Debugging
    };
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      console.log("New message received:", message); // Debugging
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    console.log("Socket listener attached"); // Debugging

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      console.log("Socket listener removed"); // Debugging
    };
  }, []);

  return (
    <ChatContext.Provider value={{ currentUser, setCurrentUser, messages, setMessages, socket, loggedUser, setLoggedUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;