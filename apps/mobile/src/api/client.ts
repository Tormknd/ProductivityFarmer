import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || "http://localhost:4000",
});

export const useApi = () => {
  const { token } = useAuth();
  
  console.log("API Client - Current token:", token ? "Token exists" : "No token");
  console.log("API Client - Token value:", token);
  
  api.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  
  console.log("API Client - Authorization header:", api.defaults.headers.common["Authorization"]);
  
  return api;
}; 