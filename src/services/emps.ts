// services/emps.ts
import api from "@/lib/axios";
import type {
  EmpCreate,
  EmpsData,
  EmpsQuery,
  EmpUpdate,
  EmpDetail,
} from "@/types/emp";
import type { ApiResponse } from "@/types/api";

// 详情：GET /emps/{id}
export function getEmployeeById(
  id: number,
  signal?: AbortSignal
): Promise<ApiResponse<EmpDetail>> {
  // 拦截器已剥壳，这里的 T 写成 ApiResponse<EmpDetail>
  return api.get<ApiResponse<EmpDetail>, ApiResponse<EmpDetail>>(
    `/emps/${id}`,
    { signal }
  );
}

// 更新：PUT /emps
export async function updateEmployee(
  payload: EmpUpdate,
  signal?: AbortSignal
): Promise<void> {
  const res = await api.put<ApiResponse<null>, ApiResponse<null>, EmpUpdate>(
    "/emps",
    payload,
    { signal }
  );
  if (res.code !== 0) throw new Error(res.msg ?? "Update failed");
}

// 查询列表：GET /emps
export function getEmployees(
  params: EmpsQuery,
  signal?: AbortSignal
): Promise<ApiResponse<EmpsData>> {
  return api.get<ApiResponse<EmpsData>, ApiResponse<EmpsData>>("/emps", {
    params,
    signal,
  });
}

// 批量删除：DELETE /emps?ids=1,2,3
export async function deleteEmployees(
  ids: number[],
  signal?: AbortSignal
): Promise<void> {
  if (!ids?.length) return;
  const res = await api.delete<ApiResponse<null>, ApiResponse<null>>("/emps", {
    params: { ids: ids.join(",") },
    signal,
  });
  if (res.code !== 0) throw new Error(res.msg ?? "Delete failed");
}

// 新增：POST /emps
export async function createEmployee(
  body: EmpCreate,
  signal?: AbortSignal
): Promise<void> {
  const res = await api.post<ApiResponse<null>, ApiResponse<null>, EmpCreate>(
    "/emps",
    body,
    { signal }
  );
  if (res.code !== 0) throw new Error(res.msg ?? "Create failed");
}
