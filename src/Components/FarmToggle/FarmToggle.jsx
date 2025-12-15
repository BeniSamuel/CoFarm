// eslint-disable-next-line react/prop-types
const FarmToggle = ({ tabActive, setTabActive }) => {
  const tabs = ["farms", "crops", "livestock", "income", "expense", "overview"];

  return (
    <div className="flex flex-row gap-4 md:gap-6 lg:gap-7 px-4 md:px-8 lg:px-12 py-4 md:py-6 overflow-x-auto border-b-2 border-[#83DF75] bg-white sticky top-0 z-10">
      {tabs.map((tab, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              setTabActive(tab);
            }}
            className="cursor-pointer flex-shrink-0 focus:outline-none"
          >
            <div
              className={`text-xs md:text-sm flex flex-col items-center gap-2 transition-colors ${
                tabActive === tab
                  ? "text-[#184B05] font-semibold"
                  : "text-[#49881F] hover:text-[#184B05]"
              }`}
            >
              <p className="capitalize">{tab}</p>
              {tabActive === tab ? (
                <div className="w-full h-1 bg-[#83DF75] rounded-lg" />
              ) : (
                <div className="w-full h-1" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FarmToggle;
