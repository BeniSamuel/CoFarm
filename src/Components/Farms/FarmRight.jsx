import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dashtop from "../Dashtop/Dashtop";
import FarmToggle from "../FarmToggle/FarmToggle";
import empty from "../../assets/empty.svg";
import { toast } from "react-hot-toast";
import axios from "axios";

const FarmRight = () => {
  const [tabActive, setTabActive] = useState("farms");
  const [farms, setFarms] = useState([]);
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    location: "",
    cropCategories: "",
    cropAmount: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/farms`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFarms(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
        toast.error("Failed to load farms");
      }
    };
    fetchFarms();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, images: files });

      // Create previews
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.area || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const farmData = new FormData();

      farmData.append("name", formData.name);
      farmData.append("area", formData.area);
      farmData.append("location", formData.location);
      if (formData.cropAmount) {
        farmData.append("cropAmount", formData.cropAmount);
      }
      if (formData.cropCategories) {
        const categoriesArray = formData.cropCategories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

        categoriesArray.forEach((category) => {
          farmData.append("cropCategories[]", category);
        });
      }

      // Append images
      formData.images.forEach((file) => {
        farmData.append("images", file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/farms`,
        farmData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFarms((prev) => [...prev, response.data.farm]);
      toast.success("Farm added successfully!");
      setShowAddFarmModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating farm:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create farm. Please try again."
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      area: "",
      location: "",
      cropCategories: "",
      cropAmount: "",
      images: [],
    });
    setImagePreviews([]);
  };

  const deleteFarm = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/farms/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFarms((prev) => prev.filter((farm) => farm._id !== id));
      toast.success("Farm deleted successfully!");
    } catch (error) {
      console.error("Error deleting farm:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete farm. Please try again."
      );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <Dashtop />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-4 border-b-2 border-[#83DF75]">
          <FarmToggle tabActive={tabActive} setTabActive={setTabActive} />
          <button
            onClick={() => setShowAddFarmModal(true)}
            className="bg-[#184B05] hover:bg-[#49881F] text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Add Farm
          </button>
        </div>
        <div className="flex-1 p-4 md:p-8">
          {farms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <img
                src={empty}
                className="h-32 w-32 md:h-44 md:w-44 mb-4"
                alt="No data"
              />
              <p className="text-sm md:text-base text-[#49881F] font-semibold">
                No farms added yet
              </p>
              <p className="text-xs md:text-sm text-[#49881F] mt-2 text-center">
                Click &quot;Add Farm&quot; to add your first farm
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm) => (
                <FarmCard key={farm._id} farm={farm} onDelete={deleteFarm} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Farm Modal */}
      {showAddFarmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-xl font-semibold text-[#184B05] mb-4">
              Add New Farm
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#184B05] mb-1">
                  Farm Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border-2 border-[#184B05] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
                  placeholder="Enter farm name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#184B05] mb-1">
                    Area (acres) *
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="w-full border-2 border-[#184B05] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
                    placeholder="e.g., 50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#184B05] mb-1">
                    Crop Amount
                  </label>
                  <input
                    type="number"
                    value={formData.cropAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, cropAmount: e.target.value })
                    }
                    className="w-full border-2 border-[#184B05] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#184B05] mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full border-2 border-[#184B05] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
                  placeholder="Enter farm location"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#184B05] mb-1">
                  Crop Categories (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.cropCategories}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cropCategories: e.target.value,
                    })
                  }
                  className="w-full border-2 border-[#184B05] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
                  placeholder="e.g., Wheat, Corn, Rice"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#184B05] mb-1">
                  Farm Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border-2 border-[#184B05] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
                />
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-lg border-2 border-[#83DF75]"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#184B05] text-white py-2 rounded-lg hover:bg-[#49881F] transition-colors text-sm font-semibold"
                >
                  Add Farm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFarmModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-[#83DF75] text-[#184B05] py-2 rounded-lg hover:bg-[#c2f0bb] transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FarmCard = ({ farm, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const farmer1 = "https://via.placeholder.com/400x300?text=Farm";

  useEffect(() => {
    if (farm.images && farm.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % farm.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [farm.images]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-[#83DF75] hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-[#c2f0bb] overflow-hidden">
        {farm.images && farm.images.length > 0 ? (
          <>
            <img
              src={
                farm.images[currentImageIndex]?.startsWith("http")
                  ? farm.images[currentImageIndex]
                  : `${import.meta.env.VITE_BACKEND_URL}${
                      farm.images[currentImageIndex]
                    }`
              }
              alt={farm.name}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            {farm.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {farm.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <img
            src={farmer1}
            alt={farm.name}
            className="w-full h-full object-cover"
          />
        )}
        <button
          onClick={() => onDelete(farm._id)}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
        >
          🗑️
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#184B05] mb-2">
          {farm.name}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#49881F] font-semibold">📍</span>
            <span className="text-[#184B05]">{farm.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#49881F] font-semibold">📏</span>
            <span className="text-[#184B05]">{farm.area} acres</span>
          </div>
          {farm.cropAmount && (
            <div className="flex items-center gap-2">
              <span className="text-[#49881F] font-semibold">🌾</span>
              <span className="text-[#184B05]">{farm.cropAmount} crops</span>
            </div>
          )}
          {farm.cropCategories && farm.cropCategories.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-[#49881F] font-semibold">🌱</span>
              <div className="flex flex-wrap gap-1">
                {farm.cropCategories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-[#83DF75] text-[#184B05] px-2 py-1 rounded text-xs font-semibold"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

FarmCard.propTypes = {
  farm: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    area: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    cropAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cropCategories: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FarmRight;
