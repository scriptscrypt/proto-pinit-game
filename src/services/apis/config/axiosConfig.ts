// services/apis/config/axiosConfig.ts
import { envAPIBaseURL } from "@/services/env/envConfig";
import { tokenStorage } from "@/services/local/tokenStorage";
import axios from "axios";

export const BASE_API_URL = envAPIBaseURL || "";

// Create an axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set up interceptor immediately
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor to handle token expiry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      tokenStorage.clearTokens();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
