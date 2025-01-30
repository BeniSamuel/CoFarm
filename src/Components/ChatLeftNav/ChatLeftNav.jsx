// ChatLeftNav.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import user1 from "../../assets/user1.png";
import { ChatContext } from "../../Context/ChatContext";

const ChatLeftNav = () => {
  const [users, setUsers] = useState([]);
  const { setCurrentUser } = useContext(ChatContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4040/api/v1/users");
        setUsers(response.data);
      } catch (error) {
        toast.error("Failed to get users!");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-[#184B05] flex flex-col h-[100vh] w-1/6 items-center pt-4 overflow-y-auto">
      <div>
        <input
          type="search"
          placeholder="search..."
          className="bg-[#83DF75] placeholder-black placeholder:text-sm h-8 w-44 pl-2 rounded-lg"
        />
      </div>
      <div className=" cursor-pointer">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              className="flex flex-col gap-24 p-3"
              key={user._id}
              onClick={() => setCurrentUser(user)}
            >
              <div className="flex items-center gap-2">
                <div>
                  <img src={user1} className="h-10 w-10" alt="user" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">
                    {user.name}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className=" flex flex-col items-center justify-center h-80"><p className="text-sm text-white">No users found</p></div>
        )}
      </div>
    </div>
  );
};

export default ChatLeftNav;
