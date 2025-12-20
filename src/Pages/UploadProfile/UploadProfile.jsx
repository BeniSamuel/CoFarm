import { useState } from "react";
import Loginleft from "../../Components/Login-Left/Loginleft";
import profile from "../../assets/profile.svg";
import editButton from "../../assets/edit.svg";
import axios from "axios";
import { toast } from "react-hot-toast";

const UploadProfile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(profile); // Default profile picture

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl); // Set the image preview
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/upload-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload the profile.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Loginleft />
      <div className="flex flex-col items-center justify-center gap-16 w-1/2">
        <div className="bg-[#83DF75] rounded-full h-32 w-32 flex flex-col items-center relative justify-center">
          <img
            src={preview}
            alt="Profile Preview"
            className="h-28 w-28 rounded-full object-cover"
          />
          <button
            className="absolute bottom-0 left-24"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <img src={editButton} alt="Edit Profile" className=" h-7" />
          </button>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }} // Hide the file input
          />
        </div>

        <div className="flex flex-col gap-9">
          <button
            className="bg-[#184B05] text-white px-6 py-3 text-sm rounded-sm"
            onClick={handleUpload}
          >
            Upload Profile
          </button>
          <button
            className="bg-[#83DF75] text-white px-6 py-3 text-sm rounded-sm"
            onClick={() => setPreview(profile)} // Reset preview
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadProfile;
