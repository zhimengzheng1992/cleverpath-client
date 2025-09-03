import axios from "axios";
import { createTypedApi } from "./typedApi"; // 这里是你刚才写的那个文件

// 先创建原始 axios 实例
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
});

// 请求拦截器，自动加 token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 或从 cookie / context 里取
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 包装成带有类型的 api
const api = createTypedApi(axiosInstance);

export default api;
