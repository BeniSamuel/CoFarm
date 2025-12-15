import Dashnav from "../../Components/Dashnav/Dashnav";
import FarmRight from "../../Components/Farms/FarmRight";

const Farm = () => {
  return (
    <div className="flex flex-row w-full min-h-screen">
      <Dashnav />
      <div className="flex-1 overflow-hidden">
        <FarmRight />
      </div>
    </div>
  );
};

export default Farm;
