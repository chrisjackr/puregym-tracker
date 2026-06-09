import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: `http://${import.meta.env.VITE_API_HOST_ORIGIN}:8000`,
});

export default api;
