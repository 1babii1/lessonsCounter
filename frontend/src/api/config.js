import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// In production, this would be an environment variable
const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
