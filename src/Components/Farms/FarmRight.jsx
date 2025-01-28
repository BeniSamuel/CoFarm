import React, { useState } from "react";
import Dashtop from "../Dashtop/Dashtop";
import FarmToggle from "../FarmToggle/FarmToggle";
import empty from "../../assets/empty.svg"

const FarmRight = () => {
  const [ tabActive, setTabActive ] = useState("farms");
  const tableFarms = null;
  return (
    <div className=" w-5/6">
      <Dashtop />
      <div>
        <FarmToggle tabActive={tabActive} setTabActive={setTabActive}/> 
        {
          tableFarms === null ? 
          (
            <div className=" flex flex-col items-center py-12">
              <img src={empty} className=" h-44 w-44"/>
              <p className=" text-sm text-green-900">No availabe data</p>
            </div>
          )
          : 
          ""
        }

      </div>
    </div>
  );
};

export default FarmRight;
