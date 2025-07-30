import axios from "axios";
import { useAuth } from "../context/AuthContext";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000",
});

export const useApi = () => {
  const { token } = useAuth();
  api.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  return api;
};
