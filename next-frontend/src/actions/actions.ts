import { axiosInstance } from "@/utils/axios";
import axios from "axios";

// Sample Code with axios

// export const login = async (email: string, password: string) => {
//   try {
//     const response = await axiosInstance.post(`/api/auth/login`, {
//       email,
//       password,
//     });
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw error.response?.data || new Error("Failed to Login");
//     }
//     throw error;
//   }
// };

export const register = async (
  username: string,
  email: string,
  password: string,
  photos: File[]
) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("fine_tuned", "false"); 
    formData.append("password", password);
    formData.append("model_version_id", "");
    photos.forEach((photo) => {
      formData.append("photos", photo); // Append each file individually
    });
    const response = await axiosInstance.post(`/signup`, formData, {
      headers: { "Content-Type": "multipart/form-data" }, //
    });
    return response.data;
  }catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Signup error:", error.response?.data);
      throw error.response?.data || new Error("Failed to Register");
    }
    throw error;
  }
};

export const getUserAvatars = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/user_avatars`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error("Failed to Login");
    }
    throw error;
  }
};

export const getHistory = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/get_avatars_with_images`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error("Failed to Login");
    }
    throw error;
  }
};


export const getVideos = async (accessToken: string, name: string) => {
  try {
    const response = await axiosInstance.get(`/get_videos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        avatar_name: name,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error("Failed to fetch videos");
    }
    throw error;
  }
};

export const generateAvatar = async (
  accessToken: string,
  gender: string,
  background: string,
  artStyle: string,
  accessories: string,
  dressing: string,
  expressionDescription: string,
  facialDetails: string
) => {
  try {
    const formData = new FormData();
    formData.append("gender", gender);
    formData.append("Background", background);
    formData.append("art_style", artStyle);
    formData.append("accessories", accessories);
    formData.append("dressing", dressing);
    formData.append("expression_description", expressionDescription);
    formData.append("facial_details", facialDetails);

    const response = await axiosInstance.post(`/avatar_gen`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error("Failed to generate avatar");
    }
    throw error;
  }
};

// Function to generate video
export const generateVideo = async (
  accessToken: string,
  avatarName: string,
  audio: File,
  text: string
) => {
  try {
    const formData = new FormData();
    formData.append("avatar_name", avatarName);
    formData.append("audio", audio);
    formData.append("text", text);

    const response = await axiosInstance.post(`/video_gen`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error("Failed to generate video");
    }
    throw error;
  }
};


