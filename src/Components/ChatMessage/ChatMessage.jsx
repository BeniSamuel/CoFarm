import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ChatContext } from "../../Context/ChatContext";
import button from "../../assets/chat-button.png";

const ChatMessage = () => {
  const { currentUser, messages, setMessages, socket, loggedUser } = useContext(ChatContext);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    axios
      .post("http://localhost:4040/api/v1/messages", {
        senderId: loggedUser._id,
        receiverId: currentUser._id,
        message,
      })
      .then((res) => {
        socket.emit("sendMessage", res.data);
        setMessages((prev) => [...prev, res.data]);
        setMessage("");
      })
      .catch((err) => console.error("Error sending Message: ", err));
  };

  // Fetch messages when currentUser changes
  useEffect(() => {
    if (currentUser) {
      axios
        .get(`http://localhost:4040/api/v1/messages/${loggedUser._id}/${currentUser._id}`)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [currentUser]); // Only run when currentUser changes

  // Socket listener for new messages
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Clean up the socket listener
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []); // Run only once on component mount

  return (
    <div className="w-3/6 flex flex-col h-[100vh]">
      <div className="h-[90vh] overflow-y-auto">
        <div className="text-sm text-center">Chat</div>
        <div>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-row ${
                msg.senderId === loggedUser._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`py-2 px-4 m-2 text-sm ${
                  msg.senderId === loggedUser._id
                    ? "bg-[#83DF75] text-black rounded-md"
                    : "bg-[#184B05] text-white"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex flex-row">
        <input
          type="text"
          placeholder="Type a message..."
          className="bg-[#83DF75] h-[3.2rem] w-[36rem] relative left-7 placeholder-black placeholder:text-sm pl-5 rounded-lg border-2 border-[#184B05] text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <img
          src={button}
          className="absolute top-3 left-[35rem] h-6 w-6 cursor-pointer"
          alt="Send"
          onClick={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatMessage;