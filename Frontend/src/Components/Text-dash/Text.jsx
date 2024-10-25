import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const Text = () => {
  const [name, setName] = useState("");
  useEffect(() => {
    async () => {
      try {
      } catch (error) {}
    };
  }, []);
  return (
    <div className=" bg-[#83DF75] h-56 w-[60rem] flex flex-col gap-12 pl-12 pt-5 rounded-3xl">
      <div className=" font-bold">
        {" "}
        {new Date(Date.now()).getHours() < 12
          ? "Good Morning"
          : new Date(Date.now()).getHours() >= 12 &&
            new Date(Date.now()).getHours() < 18
          ? "Good Afternoon"
          : "Good Evening"}
      </div>
      <p className=" font-2xl">
        You are welcomed here on the FMIS you can see the
        <br />
        information about your farm and chat with others.
      </p>
    </div>
  );
};

export default Text;
