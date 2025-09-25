import axios from "axios";
const base = import.meta.env.VITE_API_URL || "http://localhost:5173/api";

const api = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default api;