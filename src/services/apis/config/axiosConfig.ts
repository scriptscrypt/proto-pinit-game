import { envAPIBaseURL } from "@/services/env/envConfig";
import axios from "axios";

export const BASE_API_URL = envAPIBaseURL || "";

// Create an axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add authorization token to requests
export const setupAuthInterceptor = (accessToken: string) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
