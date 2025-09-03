// src/lib/axios.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 请求拦截器
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 0 && res.code !== 200) {
      return Promise.reject(res.msg || "Unknown error");
    }
    return res.data; // 👈 直接返回 data
  },
  (error) => Promise.reject(error.response?.data?.msg || error.message)
);

// ✅ 用函数重载声明 post/get 的返回值类型
interface TypedApi extends AxiosInstance {
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export default api as TypedApi;
