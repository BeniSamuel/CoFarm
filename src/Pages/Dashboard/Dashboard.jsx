import { useContext, useEffect, useState } from "react";
import Dashnav from "../../Components/Dashnav/Dashnav";
import Dashtop from "../../Components/Dashtop/Dashtop";
import Text from "../../Components/Text-dash/Text";
import Category from "../../Components/Category/Category";
import Dashgraph from "../../Components/Dashgraph/Dashgraph";
import Notifications from "../../Components/Notifications/Notifications";
import { ChatContext } from "../../Context/ChatContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { loggedUser, fetchLoggedUser } = useContext(ChatContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }

    // If loggedUser is not loaded, try to fetch it
    if (!loggedUser?._id) {
      fetchLoggedUser().then(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }

    // Set a timeout as fallback in case fetch takes too long
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [loggedUser?._id, navigate, fetchLoggedUser]);

  if (isLoading || !loggedUser?._id) {
    return (
      <div className="flex flex-row w-full min-h-screen">
        <Dashnav />
        <div className="flex-1 flex flex-col h-[100vh] overflow-hidden">
          <Dashtop />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#184B05] mx-auto mb-4"></div>
              <p className="text-[#49881F]">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full min-h-screen">
      <Dashnav />
      <div className="flex-1 flex flex-col h-[100vh] overflow-hidden">
        <Dashtop />
        <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-y-auto py-4 md:py-6 px-4 md:px-6 lg:px-12">
          <div className="w-full">
            <Text />
          </div>
          <div className="w-full">
            <Category />
          </div>
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 py-4">
            <div className="flex-1 lg:flex-[2]">
              <Dashgraph />
            </div>
            <div className="flex-1 lg:flex-[1]">
              <Notifications />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
