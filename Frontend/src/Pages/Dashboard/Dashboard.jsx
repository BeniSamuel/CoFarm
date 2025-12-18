import { useEffect } from "react";
import axios from "axios";
import Dashnav from "../../Components/Dashnav/Dashnav";
import Dashtop from "../../Components/Dashtop/Dashtop";
import Text from "../../Components/Text-dash/Text";
import Category from "../../Components/Category/Category";
import { toast } from "react-hot-toast";
import Dashgraph from "../../Components/Dashgraph/Dashgraph";
import Notifications from "../../Components/Notifications/Notifications";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/");
          return;
        }
        await axios.get( `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.log("error occurred!", error);
        toast.error("Error occurred!");
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/");
        }
      }
    };
    fetchUserData();
  }, [navigate]);
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
