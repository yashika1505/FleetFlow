import axios, { AxiosInstance, AxiosError } from "axios";

/**
 * CORS & Origin Issue:
 * 
 * Backend sees requests from: http://localhost:8080 (browser address bar)
 * If we request: http://127.0.0.1:8000 - CORS sees different origin!
 * 
 * SOLUTION: Use same hostname consistently:
 * - Frontend at: http://localhost:8080 (browser)
 * - Backend requests: http://localhost:8000 (NOT 127.0.0.1)
 * 
 * Why? CORS origin = protocol + hostname + port
 * - http://localhost:8080 ≠ http://127.0.0.1:8080 (different hostnames)
 * - localhost = localhost, 127.0.0.1 = 127.0.0.1 (browser sees as different)
 */

// Create axios instance with base URL pointing to backend
const apiClient: AxiosInstance = axios.create({
  // Use localhost (not 127.0.0.1) to match frontend's origin for CORS
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Log requests in development
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    // Add authorization token if needed
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors properly
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API] Response: ${response.status} ${response.statusText}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Log the actual error for debugging
    if (error.response) {
      // Server responded with error status
      console.error(`[API ${error.response.status}]`, error.response.data);
      
      if (error.response.status === 401) {
        console.error("Unauthorized - please log in");
      } else if (error.response.status === 403) {
        console.error("Forbidden - you don't have permission");
      } else if (error.response.status === 404) {
        console.error("Resource not found");
      } else if (error.response.status === 500) {
        console.error("Server error - please try again later");
      }
    } else if (error.request) {
      // Request made but no response (network error, CORS, etc)
      console.error("[API Network Error]", error.request);
      console.error("Is backend running? Check http://localhost:8000/health in browser");
    } else {
      // Error setting up request
      console.error("[API Setup Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
