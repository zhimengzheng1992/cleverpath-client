// src/services/auth.ts
import api from "@/lib/axios";

interface LoginRequest {
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
  return api.post<LoginResponse>("/login", payload);
}
