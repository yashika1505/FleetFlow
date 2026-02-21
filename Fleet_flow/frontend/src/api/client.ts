import axios, { AxiosInstance, AxiosError } from "axios";

// Create axios instance with base URL pointing to backend
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if needed
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      console.error("Unauthorized - please log in");
    } else if (error.response?.status === 403) {
      console.error("Forbidden - you don't have permission");
    } else if (error.response?.status === 404) {
      console.error("Resource not found");
    } else if (error.response?.status === 500) {
      console.error("Server error - please try again later");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
