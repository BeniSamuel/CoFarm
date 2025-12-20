import { useContext } from "react";
import { ChatContext } from "../../Context/ChatContext";
import user1 from "../../assets/user1.png";

const ProfileChat = () => {
  const { currentUser } = useContext(ChatContext);

  if (!currentUser)
    return (
      <div className="w-full h-full bg-[#83DF75] flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-sm md:text-base text-[#184B05] font-semibold">
            Select a user to view their profile
          </p>
        </div>
      </div>
    );

  return (
    <div className="w-full h-full bg-[#83DF75] flex flex-col items-center py-6 px-4 overflow-y-auto">
      <div className="w-full">
        <h2 className="text-base md:text-lg font-semibold text-[#184B05] mb-6 text-center">
          User Information
        </h2>
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-32 w-32 md:h-40 md:w-40 bg-[#a9ea9f] rounded-full flex items-center justify-center border-4 border-[#184B05] shadow-lg">
              <img
                src={user1}
                className="h-28 w-28 md:h-36 md:w-36 rounded-full object-cover"
                alt="Profile"
              />
            </div>
            <div className="absolute bottom-0 right-0 h-6 w-6 md:h-8 md:w-8 bg-green-500 border-4 border-[#83DF75] rounded-full"></div>
          </div>
          <div className="w-full space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <label className="text-xs text-[#49881F] font-semibold uppercase">
                Name
              </label>
              <h2 className="text-base md:text-lg font-bold text-[#184B05] mt-1">
                {currentUser.name}
              </h2>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <label className="text-xs text-[#49881F] font-semibold uppercase">
                Email
              </label>
              <p className="text-sm md:text-base text-[#184B05] mt-1 break-words">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileChat;
