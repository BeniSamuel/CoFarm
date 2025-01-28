// src/Components/ProfileChat/ProfileChat.js

import React, { useContext } from "react";
import { ChatContext } from "../../Context/ChatContext";

const ProfileChat = () => {
  const { currentUser } = useContext(ChatContext);

  if (!currentUser)
    return (
      <div className=" w-2/6 bg-[#83DF75] flex flex-col items-center justify-center pt-3 text-sm">
        Select a user to view their profile
      </div>
    );

  return (
    <div className="w-2/6 bg-[#83DF75] flex flex-col items-center pt-3 gap-8 ">
      <div className=" flex flex-col items-center text-sm font-semibold">Information</div>
      <div className=" flex flex-col items-center h-40 w-40 bg-[#a9ea9f] rounded-full">
        <img src="" alt="Profile" />
      </div>
      <div className=" flex flex-col justify-center items-center">
        <h2 className=" text-sm ">{currentUser.name}</h2>
        <p className=" text-sm ">{currentUser.email}</p>
      </div>
    </div>
  );
};

export default ProfileChat;
