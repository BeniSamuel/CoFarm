import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ChatContext } from "../../Context/ChatContext";

const Text = () => {
  const token = localStorage.getItem("accessToken");
  const { loggedUser, setLoggedUser } = useContext(ChatContext);

  useEffect(() => {
    const userInform = async () => {
      try {
        const res = await axios.get("http://localhost:4040/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoggedUser(res.data);
      } catch (error) {
        console.error("Error occurred: ", error);
      }
    };
    if (token) {
      userInform();
    }
  }, [token, setLoggedUser]);

  const messages = [
    "You are welcomed here on the CoFarm. You can see the information about your farm and chat with others.",
    "Keep your farm healthy and productive with CoFarm insights!",
    "Check out the latest updates on your farm and connect with others here on CoFarm.",
    "CoFarm empowers you to manage your farm efficiently and collaborate with the community.",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Cycle through messages
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [messages.length]);

  return (
    <div className="bg-[#eaf7e8] w-full flex flex-row gap-4 px-12 py-4 transition-all duration-1000 ease-in-out rounded-lg">
      <div className=" h-14 w-1.5 bg-[#83DF75] rounded-lg" />
      <div className=" flex flex-col gap-2 justify-center ">
        <div className="font-bold text-sm flex flex-row gap-3 items-center">
          {new Date(Date.now()).getHours() < 12
            ? "Good Morning"
            : new Date(Date.now()).getHours() >= 12 &&
              new Date(Date.now()).getHours() < 18
            ? "Good Afternoon"
            : "Good Evening"}
          <p className=" text-black text-sm ">{loggedUser.name} 🖐️</p>
        </div>
        <p
          className="font-2xl text-sm transition-opacity duration-1000"
          key={currentMessageIndex} // Ensures smooth transitions
        >
          {messages[currentMessageIndex]}
        </p>
      </div>
    </div>
  );
};

export default Text;
