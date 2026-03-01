import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) config.headers.authorization = `${token}`;
  }
  return config;
});

// Unwrap backend response shape: { success, data, error, message } → res.data = data
api.interceptors.response.use(
  (res) => {
    const body = res.data as any;
    if (body && typeof body === "object" && "success" in body) {
      res.data = body.data;
    }
    return res;
  },
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

export default api;
