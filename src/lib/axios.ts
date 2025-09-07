// src/lib/axios.ts
import axios from "axios";

// 安全获取 token（避免在 SSR/Server 读 localStorage 报错）
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null; // SSR/Server 环境
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080",
  timeout: 10000,
  withCredentials: true,
  // 若用 Cookie 传递会话，打开下面一行并确保后端设置 CORS withCredentials
  // withCredentials: true,
});

// 请求拦截器：自动加 Authorization
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    // 若后端不是 Bearer 格式，按需调整
    if (!config.headers.Authorization) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 响应拦截器：统一只返回后端 JSON，避免到处写 resp.data
api.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    // 这里可以按需处理 401/刷新 token/全局错误提示等
    if (error.response?.status === 401) {
      // 清理缓存、状态
      if (typeof window !== "undefined") {
        // 避免在 SSR 环境调用
        window.location.href = "/login"; // 或用 next/navigation 的 router.push
      }
    }
    return Promise.reject(error);
  }
);

export default api;
