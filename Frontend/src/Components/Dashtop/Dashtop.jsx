import menu_icon from "../../assets/menu-component.png";
import profile_img from "../../assets/profile_image.png";
import { useContext } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { useNavigate } from "react-router-dom";

const Dashtop = () => {
  const { loggedUser } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="bg-[#83DF75] flex flex-row justify-between items-center px-3 md:px-6 w-full h-12 md:h-14 shadow-md">
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-[#49881F] rounded-md transition-colors">
          <img src={menu_icon} className="h-5 w-5 md:h-6 md:w-6" alt="Menu" />
        </button>
        <h2 className="hidden sm:block text-sm md:text-base font-semibold text-[#184B05]">
          CoFarm Dashboard
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="hidden sm:flex flex-col items-end cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleProfileClick}
        >
          <span className="text-xs md:text-sm font-semibold text-[#184B05]">
            {loggedUser?.name || "User"}
          </span>
          <span className="text-xs text-[#49881F]">
            {loggedUser?.email || ""}
          </span>
        </div>
        <div className="relative">
          <img
            src={profile_img}
            onClick={handleProfileClick}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-[#184B05] object-cover cursor-pointer hover:border-[#49881F] transition-colors"
            alt="Profile"
          />
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 bg-green-600 border-2 border-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashtop;
