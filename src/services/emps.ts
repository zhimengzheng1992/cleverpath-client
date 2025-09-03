// services/emps.ts
import api from "@/lib/axios";
import type { EmpCreate, EmpRow, EmpsData } from "@/types/emp";
// 如果你的 ApiResponse 类型定义在 typedApi.ts，直接复用它，避免重复定义
import type { ApiResponse } from "@/lib/typedApi";

export type EmpsQuery = {
  page: number;
  pageSize: number;
  name?: string;
  gender?: string;
  begin?: string;
  end?: string;
};

// 后端 data 里的详情类型（比列表更全）
export type EmpDetail = EmpRow & {
  username: string;
  image?: string | null;
  deptId?: number | null;
  entryDate?: string | null;
  job?: number | null;
  salary?: number | null;
  exprList?: Array<{
    id?: number | null;
    company?: string | null;
    job?: string | null;
    begin?: string | null;
    end?: string | null;
    empId?: number | null;
  }> | null;
};

// 更新的请求体（与接口文档一致）
export type EmpUpdate = {
  id: number;
  username: string;
  name: string;
  gender: number; // 1/2
  image?: string;
  deptId?: number;
  entryDate?: string; // YYYY-MM-DD
  job?: number;
  salary?: number;
  exprList?: Array<{
    id?: number;
    company?: string;
    job?: string;
    begin?: string; // YYYY-MM-DD
    end?: string; // YYYY-MM-DD
    empId?: number;
  }>;
};

// 详情：假设为 GET /emps/{id}（若你的后端不同，改这里即可）
export function getEmployeeById(
  id: number,
  signal?: AbortSignal
): Promise<ApiResponse<EmpDetail>> {
  return api.get<EmpDetail>(`/emps/${id}`, { signal });
}

// 更新：PUT /emps
export async function updateEmployee(
  payload: EmpUpdate,
  signal?: AbortSignal
): Promise<void> {
  const res = await api.put<null, EmpUpdate>("/emps", payload, { signal });
  if (res.code !== 200) {
    throw new Error(
      (res as any).msg ?? (res as any).message ?? "Update failed"
    );
  }
}

/**
 * 查询员工列表
 * 返回值类型：ApiResponse<EmpsData>（由 axios 封装保证）
 * 让 useEmpsQuery 再通过 select: res => res.data 解包成 {rows,total}
 */
export function getEmployees(
  params: EmpsQuery,
  signal?: AbortSignal
): Promise<ApiResponse<EmpsData>> {
  return api.get<EmpsData>("/emps", { params, signal });
}

/** 批量删除员工 */
export async function deleteEmployees(
  ids: number[],
  signal?: AbortSignal
): Promise<void> {
  if (!ids?.length) return;

  // 后端要求 /emps?ids=1,2,3
  const res = await api.delete<null>("/emps", {
    params: { ids: ids.join(",") },
    signal,
  });

  // 统一按 200 成功（若你后端有时返回 1，也可兼容：res.code === 200 || res.code === 1）
  if (!(res && (res.code === 200 || (res as any).code === 1))) {
    throw new Error(
      (res as any)?.msg ?? (res as any)?.message ?? "Delete failed"
    );
  }
}

/**
 * 新增员工
 * 成功即返回 void；失败抛错
 */
export async function createEmployee(
  body: EmpCreate,
  signal?: AbortSignal
): Promise<void> {
  // 第二个泛型是请求体类型；我们在 axios 封装里用的是 <TResponse, D=requestBody>
  const res = await api.post<null, EmpCreate>("/emps", body, { signal });
  if (res.code !== 200) {
    throw new Error(
      (res as any).msg ?? (res as any).message ?? "Create failed"
    );
  }
}
