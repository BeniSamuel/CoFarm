// src/Components/ChatMessage/ChatMessage.js

import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ChatContext } from "../../Context/ChatContext";
import button from "../../assets/chat-button.png";


const ChatMessage = () => {
  const { currentUser, messages, setMessages, socket } = useContext(ChatContext);
  const [message, setMessage] = useState("");
  const currentUserId = "665adbeb7836b14dea6fa0df";

  const sendMessage = () => {
    if (!message.trim()) return ;
    axios.post("http://localhost:4040/api/v1/messages", {
      senderId: currentUserId,
      receiverId: currentUser?._id,
      message,
    })
    .then((res) => {
      socket.emit("sendMessage", res.data);
      setMessages((prev) => [...prev, res.data]);
      setMessage("");
    })
    .catch((err) => console.error("Error sending Message: ", err));
  }

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      console.log(currentUser._id);
      axios
        .get(`http://localhost:4040/api/v1/messages/messages/${currentUser._id}`)
        .then((response) => {
          console.log(response);
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // const handleClick = () => {
  //   axios
  //     .post("http://localhost:4040/api/v1/messages", {
  //       senderId: currentUserId,
  //       receiverId: currentUser._id,
  //       message: message,
  //     })
  //     .then((response) => {
  //       socket.emit("sendMessage", response.data);
  //       setMessage("");
  //     })
  //     .catch((error) => {
  //       console.error("Error sending message:", error);
  //     });
  // };

  return (
    <div className="w-3/6 flex flex-col h-[100vh]">
      <div className=" h-[90vh] overflow-y-auto">
        <div className=" text-sm text-center">Chat</div>
        <div>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`py-2 px-4 m-2 text-sm ${
                  msg.senderId === currentUserId
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
      <div className=" relative flex flex-row">
        <input
          type="text"
          placeholder="Type a message..."
          className="bg-[#83DF75] h-[3.2rem] w-[36rem] relative left-7 placeholder-black placeholder:text-sm pl-5 rounded-lg border-2 border-[#184B05] text-sm "
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
