// src/features/employees/components/EditEmployeeDialog.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { getEmployeeById, updateEmployee } from "@/services/emps";
import type { ApiResponse } from "@/types/api";
import type { EmpUpdate, EmpDetail } from "@/types/emp";

function isYMD(s?: string | null) {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
}
function isHttpUrl(s?: string | null) {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function EditEmployeeDialog({
  open,
  onOpenChange,
  id,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  id: number | null;
}) {
  const qc = useQueryClient();

  // 详情查询（只有在 open && id 有值时才拉）
  const { data, isFetching, error } = useQuery<
    ApiResponse<EmpDetail>,
    Error,
    EmpDetail
  >({
    queryKey: ["emp-detail", id],
    enabled: open && !!id,
    queryFn: ({ signal }) => getEmployeeById(id!, signal),
    select: (res) => {
      if (!res || res.code !== 200 || !res.data) {
        throw new Error(
          (res as any)?.msg ?? (res as any)?.message ?? "Load failed"
        );
      }
      return res.data;
    },
    staleTime: 30_000,
  });

  // 本地表单状态（拿到数据后做一次填充）
  const [form, setForm] = useState<EmpUpdate | null>(null);

  useEffect(() => {
    if (data && id) {
      setForm({
        id,
        username: data.username ?? "",
        name: data.name ?? "",
        gender: Number(data.gender ?? 1),
        image: isHttpUrl(data.image) ? data.image! : undefined,
        deptId: data.deptId ?? undefined,
        entryDate: isYMD(data.entryDate) ? data.entryDate! : undefined,
        job: data.job ?? undefined,
        salary: data.salary ?? undefined,
        exprList: (data.exprList ?? [])?.map((e) => ({
          id: e?.id ?? undefined,
          company: e?.company ?? undefined,
          job: e?.job ?? undefined,
          begin: isYMD(e?.begin || "") ? e!.begin! : undefined,
          end: isYMD(e?.end || "") ? e!.end! : undefined,
          empId: e?.empId ?? undefined,
        })),
      });
    } else if (!open) {
      setForm(null); // 关闭时清空
    }
  }, [data, id, open]);

  const { mutateAsync: save, isPending } = useMutation({
    mutationFn: async () => {
      if (!form) throw new Error("No form data");
      if (!form.username?.trim()) throw new Error("username is required");
      if (!form.name?.trim()) throw new Error("name is required");
      if (![1, 2].includes(Number(form.gender)))
        throw new Error("gender must be 1 or 2");

      const payload: EmpUpdate = {
        ...form,
        username: form.username.trim(),
        name: form.name.trim(),
        gender: Number(form.gender),
        image: isHttpUrl(form.image) ? form.image : undefined,
        entryDate: isYMD(form.entryDate) ? form.entryDate : undefined,
        exprList: (form.exprList ?? [])
          .filter((e) => e.company || e.job || e.begin || e.end)
          .map((e) => ({
            id: e.id,
            company: e.company || undefined,
            job: e.job || undefined,
            begin: isYMD(e.begin) ? e.begin : undefined,
            end: isYMD(e.end) ? e.end : undefined,
            empId: e.empId,
          })),
      };

      await updateEmployee(payload);
    },
    onSuccess: () => {
      toast.success("Updated successfully");
      // 刷新列表 & 详情
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          (q.queryKey[0] === "emps" || q.queryKey[0] === "emp-detail"),
      });
      onOpenChange(false);
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Update failed");
    },
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !isPending && onOpenChange(o)}>
      <DialogContent
        onInteractOutside={(e) => isPending && e.preventDefault()}
        onEscapeKeyDown={(e) => isPending && e.preventDefault()}
        className="max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="text-sm text-red-600">{String(error.message)}</div>
        )}
        {isFetching && !form && <div className="text-sm">Loading…</div>}

        {form && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* username */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Username *</label>
              <Input
                value={form.username}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, username: e.target.value } : f))
                }
                required
              />
            </div>

            {/* name */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, name: e.target.value } : f))
                }
                required
              />
            </div>

            {/* gender */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Gender *</label>
              <select
                className="border px-3 py-2 rounded w-full"
                value={String(form.gender)}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, gender: Number(e.target.value) } : f
                  )
                }
              >
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
            </div>

            {/* deptId */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Dept ID</label>
              <Input
                type="number"
                value={form.deptId ?? ""}
                onChange={(e) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          deptId: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }
                      : f
                  )
                }
              />
            </div>

            {/* entryDate */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Entry Date</label>
              <Input
                type="date"
                value={form.entryDate ?? ""}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, entryDate: e.target.value || undefined } : f
                  )
                }
              />
            </div>

            {/* job */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Job</label>
              <Input
                type="number"
                value={form.job ?? ""}
                onChange={(e) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          job: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }
                      : f
                  )
                }
                placeholder="1..5"
              />
            </div>

            {/* salary */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Salary</label>
              <Input
                type="number"
                value={form.salary ?? ""}
                onChange={(e) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          salary: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }
                      : f
                  )
                }
              />
            </div>

            {/* image */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input
                value={form.image ?? ""}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, image: e.target.value } : f))
                }
                placeholder="https://..."
              />
            </div>

            {/* 这里可按需加入经历编辑（和 Add 里一样的 UI），略 */}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending || !form}
            onClick={() => save()}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
