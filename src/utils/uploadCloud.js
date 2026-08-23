import axios from "axios";

const uploadCloud = async (file) => {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "cc23-fb-upload");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/nantana/image/upload",
      formData,
    );

    console.log("uploadCloud response:", response.data);

    return response.data.secure_url;
  } catch (error) {
    console.error("Upload Cloudinary error:", error.response?.data || error);

    throw error;
  }
};

export default uploadCloud;
