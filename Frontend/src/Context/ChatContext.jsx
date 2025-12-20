import { createContext, useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";

export const ChatContext = createContext();

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
  autoConnect: false,
}); // Disable auto-connect

// eslint-disable-next-line react/prop-types
const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loggedUser, setLoggedUser] = useState({});
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        if (isMounted) {
          setLoggedUser({});
        }
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          setLoggedUser(response.data);

          if (response.data._id) {
            // Disconnect if already connected to avoid duplicate connections
            if (socket.connected) {
              socket.disconnect();
            }
            socket.connect();
            socket.emit("joinRoom", response.data._id);
          }
        }
      } catch (error) {
        // Suppress 401 errors during initial mount (expected when no token)
        if (error.response?.status === 401) {
          // Silent fail - token might not exist yet
        } else if (error.response?.status) {
          console.error("Auth error on mount:", error.response?.data?.message);
        }
        if (isMounted) {
          setLoggedUser({});
        }
        // Don't remove token on 401 during initial load
        if (error.response?.status === 403) {
          localStorage.removeItem("accessToken");
        }
      }
    };

    // Fetch user on mount
    fetchUserData();

    // Listen for storage changes (for cross-tab communication)
    const handleStorageChange = (e) => {
      if (e.key === "accessToken") {
        fetchUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // useEffect(() => {
  //   socket.connect(); // Connect only once
  //   console.log("Socket connected"); // Debugging

  //   return () => {
  //     socket.disconnect(); // Disconnect on unmount
  //     console.log("Socket disconnected"); // Debugging
  //   };
  // }, []);

  // Remove duplicate socket listener - handled in ChatMessage component

  useEffect(() => {
    // Fetch groups from backend API
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token && loggedUser._id) {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/groups`,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/groups`,
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

  // Function to fetch user - can be called from anywhere
  const fetchLoggedUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoggedUser({});
      return null;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoggedUser(response.data);

      if (response.data._id) {
        // Disconnect if already connected to avoid duplicate connections
        if (socket.connected) {
          socket.disconnect();
        }
        socket.connect();
        socket.emit("joinRoom", response.data._id);
      }

      return response.data;
    } catch (error) {
      // Suppress 401 errors in console during initial load (expected when no token)
      // Only log if it's a real authentication error after login
      if (error.response?.status === 401) {
        // Only log once, not repeatedly
        if (!error.response?.data?.message?.includes("not found")) {
          console.warn(
            "Authentication failed:",
            error.response?.data?.message || "Invalid token"
          );
        }
      } else if (error.response?.status) {
        console.error("Auth error:", {
          status: error.response.status,
          message: error.response?.data?.message,
        });
      }
      setLoggedUser({});
      // Don't remove token on 401 - might be a backend config issue
      // Only remove on 403 (Forbidden)
      if (error.response?.status === 403) {
        localStorage.removeItem("accessToken");
      }
      return null;
    }
  }, []);

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
        fetchLoggedUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
