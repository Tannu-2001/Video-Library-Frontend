import axios from "axios";


const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: base, // e.g. http://localhost:5000
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default api;