// typedApi.ts
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
};

export function createTypedApi(axios: AxiosInstance) {
  return {
    // 暴露你需要的 axios 属性
    defaults: axios.defaults,
    interceptors: axios.interceptors,

    // GET
    async get<T = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<ApiResponse<T>> {
      const res = await axios.get<T, AxiosResponse<T>, D>(url, config);
      return res.data as unknown as ApiResponse<T>;
    },

    // POST（T=返回数据类型，D=请求体类型）
    async post<T = any, D = any>(
      url: string,
      body?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<ApiResponse<T>> {
      const res = await axios.post<T, AxiosResponse<T>, D>(url, body, config);
      return res.data as unknown as ApiResponse<T>;
    },

    // PUT
    async put<T = any, D = any>(
      url: string,
      body?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<ApiResponse<T>> {
      const res = await axios.put<T, AxiosResponse<T>, D>(url, body, config);
      return res.data as unknown as ApiResponse<T>;
    },

    // PATCH
    async patch<T = any, D = any>(
      url: string,
      body?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<ApiResponse<T>> {
      const res = await axios.patch<T, AxiosResponse<T>, D>(url, body, config);
      return res.data as unknown as ApiResponse<T>;
    },

    // DELETE
    async delete<T = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<ApiResponse<T>> {
      const res = await axios.delete<T, AxiosResponse<T>, D>(url, config);
      return res.data as unknown as ApiResponse<T>;
    },

    // 通用 request
    async request<T = any, D = any>(
      config: AxiosRequestConfig<D>
    ): Promise<ApiResponse<T>> {
      const res = await axios.request<T, AxiosResponse<T>, D>(config);
      return res.data as unknown as ApiResponse<T>;
    },
  };
}
