import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChatContext } from "../../Context/ChatContext";
import button from "../../assets/chat-button.png";
import { toast } from "react-hot-toast";

const ChatMessage = () => {
  const { currentUser, messages, setMessages, socket, loggedUser } =
    useContext(ChatContext);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentUser || !loggedUser._id) return;

    const messageText = message.trim();

    // Check if it's a group chat or private chat
    if (currentUser.isGroup) {
      // Send group message via API
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(
           `${import.meta.env.VITE_BACKEND_URL}/api/v1/groups/${currentUser._id}/messages`,
          { message: messageText },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Socket will handle broadcasting, but we can optimistically add
        setMessages((prev) => [...prev, response.data]);
        setMessage("");
      } catch (error) {
        console.error("Error sending group message:", error);
        toast.error("Failed to send message");
      }
    } else {
      // Send private message via socket
      const messageData = {
        senderId: loggedUser._id,
        receiverId: currentUser._id,
        message: messageText,
      };

      socket.emit("sendMessage", messageData);
      // Optimistically add message to UI
      setMessages((prev) => [
        ...prev,
        { ...messageData, createdAt: new Date().toISOString() },
      ]);
      setMessage("");
    }
  };

  // Fetch messages when currentUser changes
  useEffect(() => {
    if (currentUser && loggedUser._id) {
      setMessages([]); // Clear previous messages

      // Check if it's a group chat or private chat
      if (currentUser.isGroup) {
        // Fetch group messages
        const token = localStorage.getItem("accessToken");
        axios
          .get(
             `${import.meta.env.VITE_BACKEND_URL}/api/v1/groups/${currentUser._id}/messages`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            setMessages(response.data || []);
            // Join group room
            socket.emit("joinGroupRoom", currentUser._id);
          })
          .catch((error) => {
            console.error("Error fetching group messages:", error);
            setMessages([]);
          });
      } else {
        // Fetch private messages
        axios
          .get(
             `${import.meta.env.VITE_BACKEND_URL}/api/v1/messages/${loggedUser._id}/${currentUser._id}`
          )
          .then((response) => {
            setMessages(response.data || []);
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
            setMessages([]);
          });
      }
    } else {
      setMessages([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentUser?._id,
    currentUser?.isGroup,
    loggedUser._id,
    setMessages,
    socket,
  ]); // Run when currentUser or loggedUser changes

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket listener for new messages
  useEffect(() => {
    if (!currentUser || !loggedUser._id) return;

    if (currentUser.isGroup) {
      // Handle group messages
      const handleReceiveGroupMessage = (newMessage) => {
        // Only add message if it's for the current group
        if (newMessage.groupId === currentUser._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };

      socket.on("receiveGroupMessage", handleReceiveGroupMessage);

      return () => {
        socket.off("receiveGroupMessage", handleReceiveGroupMessage);
      };
    } else {
      // Handle private messages
      const handleReceiveMessage = (newMessage) => {
        // Only add message if it's for the current conversation
        if (
          (newMessage.senderId === currentUser._id &&
            newMessage.receiverId === loggedUser._id) ||
          (newMessage.senderId === loggedUser._id &&
            newMessage.receiverId === currentUser._id)
        ) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      // Clean up the socket listener
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentUser?._id,
    currentUser?.isGroup,
    loggedUser._id,
    socket,
    setMessages,
  ]); // Include dependencies

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col h-[100vh] items-center justify-center bg-white">
        <div className="text-center p-6">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-sm md:text-base text-[#49881F] font-semibold">
            Select a user to start chatting
          </p>
          <p className="text-xs md:text-sm text-[#49881F] mt-2">
            Choose a conversation from the left sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[100vh] bg-white">
      <div className="flex-1 overflow-y-auto bg-white flex flex-col">
        <div className="sticky top-0 bg-[#83DF75] text-sm text-center py-3 text-[#184B05] font-semibold border-b-2 border-[#184B05] z-10">
          {currentUser.name}
        </div>
        <div className="flex-1 p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#49881F] text-sm">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`flex flex-row ${
                  (msg.senderId?._id || msg.senderId) === loggedUser._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md py-2 px-4 text-sm rounded-lg shadow-sm ${
                    (msg.senderId?._id || msg.senderId) === loggedUser._id
                      ? "bg-[#83DF75] text-black rounded-br-none"
                      : "bg-[#184B05] text-white rounded-bl-none"
                  }`}
                >
                  {currentUser.isGroup && msg.senderId?.name && (
                    <div className="text-xs font-semibold mb-1 opacity-75">
                      {msg.senderId.name}
                    </div>
                  )}
                  {msg.message}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="sticky bottom-0 bg-white border-t-2 border-[#184B05] p-4">
        <div className="relative flex flex-row items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="bg-[#83DF75] h-[3.2rem] flex-1 placeholder-black placeholder:text-sm pl-5 pr-12 rounded-lg border-2 border-[#184B05] text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="absolute right-2 p-2 rounded-full hover:bg-[#49881F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={button} className="h-6 w-6 cursor-pointer" alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
