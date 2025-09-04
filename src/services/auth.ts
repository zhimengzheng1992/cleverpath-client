// src/services/auth.ts
import api from "@/lib/axios";
import { LoginRequest, LoginResponse, LoginData } from "@/types/auth";

export async function login(payload: LoginRequest): Promise<LoginData> {
  // ✅ 正确的泛型顺序：<返回的 data 类型，请求体类型>
  const resp = await api.post<LoginResponse, LoginResponse>("/login", payload);

  const { code, msg, data } = resp;

  if (code !== 200 || !data) {
    throw new Error(msg ?? "Login failed");
  }

  return data;
}
