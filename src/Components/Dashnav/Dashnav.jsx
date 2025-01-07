import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import dash_img from "../../assets/dashboard.png";

const Dashnav = () => {
  const [tabs, setTabs] = useState("dashboard");
  const navigate = useNavigate();

  function handleChatClick() {
    setTabs("chats");
    navigate("/chat");
  }

  function handleFarmClick() {
    setTabs("farms");
    navigate("/farms");
  }

  function handleDashClick() {
    setTabs("dashboard");
    navigate("/dashboard");
  }
  return (
    <div className=" bg-[#184B05] flex flex-col w-1/6 h-[100vh] items-center  py-4 gap-20">
      <div className=" text-white font-bold">FMIS</div>
      <div className="  h-5/6 flex flex-col items-center justify-between">
        <ul className=" flex flex-col gap-6">
          <li
            className={`text-white font-semibold cursor-pointer flex flex-row items-center gap-3 ${
              tabs === "dashboard"
                ? "bg-white bg-opacity-30 flex flex-row w-48 h-10 rounded-md"
                : ""
            }`}
            onClick={handleDashClick}
          >
            {tabs == "dashboard" ? (
              <div className=" h-10 w-2 rounded-md bg-white"></div>
            ) : (
              ""
            )}
            <img src={dash_img} className=" h-4 w-4" />
            Dashboard
          </li>
          <li
            className={`text-white font-semibold cursor-pointer flex flex-row items-center ${
              tabs === "chats"
                ? "bg-white bg-opacity-30 flex flex-row w-48 h-10 rounded-md"
                : ""
            }`}
            onClick={handleChatClick}
          >
            Chats
          </li>
          <li
            className={`text-white font-semibold cursor-pointer flex flex-row items-center gap-3 ${
              tabs === "farms"
                ? "bg-white bg-opacity-30 flex flex-row w-48 h-10 rounded-md"
                : ""
            }`}
            onClick={handleFarmClick}
          >
            {" "}
            {tabs == "farms" ? (
              <div className=" h-10 w-2 rounded-md bg-white"></div>
            ) : (
              ""
            )}
            My Farms
          </li>
        </ul>
        <div>
          <button className=" text-white bg-white bg-opacity-30 w-48 h-10 rounded-md font-semibold">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashnav;
