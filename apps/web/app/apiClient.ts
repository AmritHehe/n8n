import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API ,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

console.log("backend api " + process.env.NEXT_PUBLIC_BACKEND_API)

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("token " + token) ; 
    //@ts-ignore
    if (token) config.headers.authorization = `${token}`;
  }
  return config;
});


export default api;
