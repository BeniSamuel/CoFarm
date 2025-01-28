import React from "react";
import menu_icon from "../../assets/menu-component.png";
import profile_img from "../../assets/profile_image.png";

const Dashtop = () => {
  return (
    <div className=" bg-[#83DF75] flex flex-row justify-between items-center px-6 w-full h-14">
      <div>
        <img src={menu_icon} className=" h-7 w-7" />
      </div>
      <div>
        <img src={profile_img} className=" h-9 w-9" />
        <div className=" bg-green-900 h-2 w-2 rounded-full relative bottom-2 left-7 "></div>
      </div>
    </div>
  );
};

export default Dashtop;
