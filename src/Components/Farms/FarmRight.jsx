import React, { useState } from "react";
import Dashtop from "../Dashtop/Dashtop";
import FarmToggle from "../FarmToggle/FarmToggle";

const FarmRight = () => {
  const [ tabActive, setTabActive ] = useState("farms");
  return (
    <div className=" w-5/6">
      <Dashtop />
      <div>
        <FarmToggle tabActive={tabActive} setTabActive={setTabActive}/> 
      </div>
    </div>
  );
};

export default FarmRight;
