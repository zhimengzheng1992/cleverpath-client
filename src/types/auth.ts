export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginData {
  id: number;
  username: string;
  name: string;
  token: string;
}

export interface LoginResponse {
  code: number; // 业务状态码，0 表示成功
  msg: string; // 后端返回的提示信息
  data: LoginData;
}
