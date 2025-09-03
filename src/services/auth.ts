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

  if (!resp || resp.code !== 200 || !resp.data) {
    throw new Error(
      (resp as any)?.msg ?? (resp as any)?.message ?? "Login failed"
    );
  }

  return resp.data;
}
