"use client";
import { useEffect } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { getEmployees, EmpsQuery } from "@/services/emps";
import type { EmpRow } from "@/types/emp";
import type { ApiResponse } from "@/lib/typedApi"; // 你定义 ApiResponse 的地方

type EmpsPayload = { rows: EmpRow[]; total: number };

export const useEmpsQuery = (args: EmpsQuery) => {
  const { page, pageSize, name = "", gender = "", begin = "", end = "" } = args;
  const queryClient = useQueryClient();
  const queryKey = qk.emps(page, pageSize, name.trim(), gender, begin, end);

  const query = useQuery<ApiResponse<EmpsPayload>, Error, EmpsPayload>({
    queryKey,
    queryFn: ({ signal }) =>
      getEmployees({ page, pageSize, name, gender, begin, end }, signal),
    select: (res) => {
      if (!res || res.code !== 200) {
        throw new Error(
          (res as any)?.msg ?? (res as any)?.message ?? "Request failed"
        );
      }
      return res.data as EmpsPayload;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!query.data) return;

    const totalPages = Math.max(
      1,
      Math.ceil((query.data.total || 0) / pageSize)
    );
    if (page < totalPages) {
      const next = page + 1;
      queryClient.prefetchQuery<ApiResponse<EmpsPayload>>({
        queryKey: qk.emps(next, pageSize, name.trim(), gender, begin, end),
        queryFn: ({ signal }) =>
          getEmployees(
            { page: next, pageSize, name, gender, begin, end },
            signal
          ),
        staleTime: 30_000,
      });
    }
  }, [page, pageSize, name, gender, begin, end, query.data, queryClient]);

  return query;
};
