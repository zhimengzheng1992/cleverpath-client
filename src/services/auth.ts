// src/services/auth.ts
import api from "@/lib/axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  name: string;
  token: string;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  // ✅ 正确的泛型顺序：<返回的 data 类型，请求体类型>
  const resp = await api.post<LoginResponse, LoginRequest>("/login", payload);

  // 兼容 message/msg，并在失败时抛错
  const code = resp?.code ?? 0;
  const data = resp?.data ?? null;
  const message =
    (resp as any)?.message ?? (resp as any)?.msg ?? "Login failed";

  if (code !== 200 || !data) {
    throw new Error(message); // ← 这里抛出 “用户名不存在”
  }
  return data;
}
