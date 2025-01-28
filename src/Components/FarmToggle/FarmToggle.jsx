import React from "react";

const FarmToggle = ({ tabActive, setTabActive }) => {
  const tabs = ["farms", "crops", "livestock", "income", "expense", "overview"];

  return (
    <div className=" flex flex-row gap-7 px-12 py-7 ">
      {tabs.map((tab, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              setTabActive(tab);
            }}
            className=" cursor-pointer"
          >
            <div
              className={` text-sm flex flex-col items-center gap-1 ${
                tabActive === tab ? " text-green-600" : "text-black"
              }`}
            >
              <p>{tab}</p>

              {tabActive == tab ? (
                <div className=" w-16 h-1 bg-[#83DF75] rounded-lg" />
              ) : (
                ""
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FarmToggle;
