import ChatLeftNav from "../../Components/ChatLeftNav/ChatLeftNav";
import ChatMessage from "../../Components/ChatMessage/ChatMessage";
import ProfileChat from "../../Components/ProfileChat/ProfileChat";

const Chat = () => {
  return (
    <div className="flex flex-row w-full h-screen overflow-hidden bg-[#F8FAFC]">
      <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
        <ChatLeftNav />
      </div>
      <div className="flex-1 min-w-0 flex">
        <ChatMessage />
      </div>
      <div className="hidden lg:flex lg:w-1/3 min-w-[320px] flex-shrink-0">
        <ProfileChat />
      </div>
    </div>
  );
};

export default Chat;
