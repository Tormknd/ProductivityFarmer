import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || "http://10.139.19.193:4000",
});

export const useApi = () => {
  const { token } = useAuth();
  
  api.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  
  return api;
}; 