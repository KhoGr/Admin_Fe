import axios from "axios";

// Đọc baseURL từ biến môi trường
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL, // ← dùng biến thay vì hardcode
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/account/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
