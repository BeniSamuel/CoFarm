import React from "react";
import farmer1 from "../../assets/farmer1.png";

const Loginleft = () => {
  return (
    <div className="h-[85vh] bg-[#184B05] md:h-[100vh] flex flex-col items-center w-full md:w-1/2 justify-center ">
      <div className=" flex flex-col gap-14 items-center">
        <div className=" bg-[#83DF75] h-[20rem] w-[20rem] md:h-[23rem] md:w-[23rem] rounded-full flex flex-col items-center justify-center ">
          <img src={farmer1} className="h-60 w-48  md:h-80 md:w-[17rem]" />
        </div>
        <p className=" text-white text-sm md:font-medium md:text-sm">
          Join the family of farmers
        </p>
      </div>
    </div>
  );
};

export default Loginleft;
