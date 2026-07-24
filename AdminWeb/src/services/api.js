import axios from "axios";

const api = axios.create({
  baseURL: "https://omishgo.onrender.com/api/v1", // Adjust to actual backend URL in production
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
