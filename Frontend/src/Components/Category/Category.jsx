const Category = () => {
  const categories = [
    { name: "Total Farms", value: "0", icon: "🚜" },
    { name: "Active Crops", value: "0", icon: "🌾" },
    { name: "Livestock", value: "0", icon: "🐄" },
    { name: "Revenue", value: "$0", icon: "💰" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-10 w-full">
      {categories.map((category, index) => (
        <div
          key={index}
          className="bg-[#c2f0bb] w-full h-32 md:h-40 lg:h-44 flex flex-col items-center justify-center pt-3 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#83DF75]"
        >
          <div className="text-3xl md:text-4xl mb-2">{category.icon}</div>
          <div className="text-lg md:text-xl font-bold text-[#184B05]">
            {category.value}
          </div>
          <div className="text-xs md:text-sm text-[#49881F] font-semibold text-center px-2 mt-1">
            {category.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Category;
