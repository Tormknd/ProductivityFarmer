import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || "http://10.139.19.193:4000",
});

export const useApi = () => {
  const { token } = useAuth();
  
  console.log("API Client - Base URL:", Constants.expoConfig?.extra?.apiUrl || "http://10.139.19.193:4000");
  console.log("API Client - Current token:", token ? "Token exists" : "No token");
  console.log("API Client - Token value:", token);
  
  api.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  
  console.log("API Client - Authorization header:", api.defaults.headers.common["Authorization"]);
  
  // Add request interceptor for debugging
  api.interceptors.request.use(
    (config) => {
      console.log("API Request:", config.method?.toUpperCase(), config.url);
      console.log("API Request Headers:", config.headers);
      return config;
    },
    (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  api.interceptors.response.use(
    (response) => {
      console.log("API Response:", response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error("API Response Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });
      
      // Create a more informative error message
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        error.message = `Network Error: Cannot connect to API server at ${error.config?.baseURL}. Please check if the server is running.`;
      } else if (error.response?.status === 401) {
        error.message = 'Authentication Error: Please log in again.';
      } else if (error.response?.status === 404) {
        error.message = 'API Endpoint Not Found: The requested resource does not exist.';
      } else if (error.response?.status >= 500) {
        error.message = 'Server Error: The API server encountered an error.';
      } else if (!error.response) {
        error.message = 'Network Error: No response from server. Check your internet connection.';
      }
      
      return Promise.reject(error);
    }
  );
  
  return api;
}; 