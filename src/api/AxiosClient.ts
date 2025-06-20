
import axios from "axios";


const axiosClient = axios.create({
  baseURL: "https://app.genez.io/project/0047d1ef-a2f7-4e6b-811a-71f7d6577a93/57fad252-45fb-4571-bf98-fe2615926365/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor thêm token vào request
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

// ✅ Interceptor xử lý lỗi response
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
