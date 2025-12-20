import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

export const ChatContext = createContext();

const socket = io("http://localhost:4040", { autoConnect: false }); // Disable auto-connect

// eslint-disable-next-line react/prop-types
const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loggedUser, setLoggedUser] = useState({});
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await axios.get(
            "http://localhost:4040/api/v1/users/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLoggedUser(response.data);

          // Join socket room with userId
          if (response.data._id) {
            socket.emit("joinRoom", response.data._id);
          }
        }
      } catch (error) {
        console.error("Error fetching logged user:", error);
      }
    };

    fetchLoggedUser();
  }, []);

  useEffect(() => {
    socket.connect(); // Connect only once
    console.log("Socket connected"); // Debugging

    return () => {
      socket.disconnect(); // Disconnect on unmount
      console.log("Socket disconnected"); // Debugging
    };
  }, []);

  // Remove duplicate socket listener - handled in ChatMessage component

  useEffect(() => {
    // Fetch groups from backend API
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token && loggedUser._id) {
          const response = await axios.get(
            "http://localhost:4040/api/v1/groups",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setGroups(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    if (loggedUser._id) {
      fetchGroups();
    }
  }, [loggedUser._id]);

  const addGroup = (group) => {
    setGroups((prev) => [...prev, group]);
  };

  const refreshGroups = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await axios.get(
          "http://localhost:4040/api/v1/groups",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGroups(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        messages,
        setMessages,
        socket,
        loggedUser,
        setLoggedUser,
        groups,
        addGroup,
        refreshGroups,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
