// src/Components/ProfileChat/ProfileChat.js

import React, { useContext } from "react";
import { ChatContext } from "../../Context/ChatContext";

const ProfileChat = () => {
  const { currentUser } = useContext(ChatContext);

  if (!currentUser)
    return (
      <div className=" w-2/6 bg-[#83DF75] flex flex-col items-center pt-3">
        Select a user to view their profile
      </div>
    );

  return (
    <div className="w-2/6 bg-[#83DF75] flex flex-col items-center pt-3">
      <div>
        <h2>{currentUser.name}</h2>
        <p>{currentUser.email}</p>
      </div>
      <div>
        <img src="" alt="Profile" />
      </div>
      <div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default ProfileChat;
