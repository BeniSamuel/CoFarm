import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import Dashnav from "../../Components/Dashnav/Dashnav";
import Dashtop from "../../Components/Dashtop/Dashtop";
import Text from "../../Components/Text-dash/Text";
import Category from "../../Components/Category/Category";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    async () => {
      try {
        const response = await axios.get("http://localhost:4040/users");
        setName(response.data);
      } catch (error) {
        console.log("error occured!");
        toast.error("error occured!");
      }
    };
  }, []);
  return (
    <div className=" flex flex-row w-full">
      <Dashnav className="" />
      <div className=" placeholder: w-10/12 flex flex-col gap-6">
        <Dashtop />
        <div className=" flex items-center justify-center">
          <Text />
        </div>
        <div className=" flex items-center justify-center">
          <Category />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
