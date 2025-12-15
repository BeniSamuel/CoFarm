import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ChatContext } from "../../Context/ChatContext";
import { useContext } from "react";
import profile_img from "../../assets/profile_image.png";

const Profile = () => {
  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(ChatContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4040/api/v1/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoggedUser(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
        });
      } catch (error) {
        toast.error("Failed to fetch user data");
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/");
        }
      }
    };

    fetchUser();
  }, [navigate, setLoggedUser]);

  const handleUpdate = async () => {
    try {
      // Note: Update endpoint would need to be implemented in backend
      // For now, just update locally
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setLoggedUser({ ...loggedUser, ...formData });
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex flex-row w-full min-h-screen">
      <div className="flex-1 flex flex-col h-[100vh] overflow-hidden">
        <div className="bg-[#83DF75] flex flex-row justify-between items-center px-3 md:px-6 w-full h-12 md:h-14 shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="text-[#184B05] font-semibold hover:text-[#49881F] transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-sm md:text-base font-semibold text-[#184B05]">
            My Profile
          </h2>
          <div className="w-16"></div>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#eaf7e8] p-4 md:p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <img
                    src={profile_img}
                    className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-[#83DF75] object-cover shadow-lg"
                    alt="Profile"
                  />
                  <button className="absolute bottom-0 right-0 bg-[#184B05] text-white p-2 rounded-full hover:bg-[#49881F] transition-colors">
                    📷
                  </button>
                </div>
                {!isEditing ? (
                  <>
                    <h2 className="text-xl md:text-2xl font-bold text-[#184B05] mb-2">
                      {loggedUser?.name || "User"}
                    </h2>
                    <p className="text-sm md:text-base text-[#49881F] mb-4">
                      {loggedUser?.email || ""}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-[#184B05] text-white px-6 py-2 rounded-lg hover:bg-[#49881F] transition-colors text-sm font-semibold"
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#184B05] mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border-2 border-[#184B05] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#184B05] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full border-2 border-[#184B05] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdate}
                        className="flex-1 bg-[#184B05] text-white py-2 rounded-lg hover:bg-[#49881F] transition-colors text-sm font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: loggedUser?.name || "",
                            email: loggedUser?.email || "",
                          });
                        }}
                        className="flex-1 bg-[#83DF75] text-[#184B05] py-2 rounded-lg hover:bg-[#c2f0bb] transition-colors text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-[#83DF75] pt-6 space-y-4">
                <div className="bg-[#eaf7e8] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#184B05] mb-2">
                    Account Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#49881F]">Member Since:</span>
                      <span className="text-[#184B05]">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#49881F]">Status:</span>
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#eaf7e8] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#184B05] mb-2">
                    Account Settings
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full text-left text-sm text-[#49881F] hover:text-[#184B05] transition-colors py-1">
                      Change Password
                    </button>
                    <button className="w-full text-left text-sm text-[#49881F] hover:text-[#184B05] transition-colors py-1">
                      Privacy Settings
                    </button>
                    <button className="w-full text-left text-sm text-[#49881F] hover:text-[#184B05] transition-colors py-1">
                      Notification Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
