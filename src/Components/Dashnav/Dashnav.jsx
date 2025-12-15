import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dash_img from "../../assets/dashboard.png";
import mess_icon from "../../assets/message.svg";
import farm_icon from "../../assets/farm.svg";
import { toast } from "react-hot-toast";

const Dashnav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");

  // Sync activeTab with the current route on initial render and route changes
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/dashboard")) setActiveTab("dashboard");
    else if (currentPath.includes("/chat")) setActiveTab("chats");
    else if (currentPath.includes("/farms")) setActiveTab("farms");
  }, [location]);

  const handleNavigation = (tab, route) => {
    if (activeTab !== tab) {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="bg-[#184B05] flex flex-col w-1/6 h-[100vh] items-center py-4 gap-20">
      <div
        className="text-white font-bold text-sm cursor-pointer"
        onClick={() => handleNavigation("dashboard", "/dashboard")}
      >
        CoFarm
      </div>
      <div className="h-5/6 flex flex-col items-center justify-between">
        <ul className="flex flex-col gap-6">
          <li
            className={`text-white font-semibold cursor-pointer flex flex-row items-center gap-3 text-sm transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-white bg-opacity-30 w-48 h-10 rounded-md"
                : "hover:bg-white hover:bg-opacity-20 rounded-md h-10"
            }`}
            onClick={() => handleNavigation("dashboard", "/dashboard")}
          >
            {activeTab === "dashboard" && (
              <div className="h-10 w-2 rounded-md bg-white"></div>
            )}
            <img src={dash_img} className="h-4 w-4" alt="Dashboard" />
            Dashboard
          </li>
          <li
            className={`text-white font-semibold cursor-pointer flex flex-row items-center gap-3 text-sm transition-all duration-200 ${
              activeTab === "chats"
                ? "bg-white bg-opacity-30 w-48 h-10 rounded-md"
                : "hover:bg-white hover:bg-opacity-20 rounded-md h-10 "
            }`}
            onClick={() => handleNavigation("chats", "/chat")}
          >
            {activeTab === "chats" && (
              <div className="h-10 w-2 rounded-md bg-white"></div>
            )}
            <img src={mess_icon} className="h-4 w-4" alt="Chats" />
            Chats
          </li>
          <li
            className={`text-white font-semibold cursor-pointer flex flex-row items-center gap-3 text-sm transition-all duration-200 ${
              activeTab === "farms"
                ? "bg-white bg-opacity-30 w-48 h-10 rounded-md"
                : "hover:bg-white hover:bg-opacity-20 rounded-md h-10"
            }`}
            onClick={() => handleNavigation("farms", "/farms")}
          >
            {activeTab === "farms" && (
              <div className="h-10 w-2 rounded-md bg-white"></div>
            )}
            <img src={farm_icon} className="h-4 w-4" alt="My Farms" />
            My Farms
          </li>
        </ul>
        <div>
          <button
            onClick={handleLogout}
            className="text-white bg-white bg-opacity-30 w-48 h-10 rounded-md font-semibold text-sm transition-all duration-200 hover:bg-opacity-40"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashnav;
