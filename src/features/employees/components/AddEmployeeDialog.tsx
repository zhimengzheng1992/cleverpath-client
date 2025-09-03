"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createEmployee } from "@/services/emps";
import type { EmpCreate, EmpExpr } from "@/types/emp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function AddEmployeeDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  // 基本字段
  const [form, setForm] = useState<EmpCreate>({
    username: "",
    name: "",
    gender: 1,
    phone: "",
    image: "",
    deptId: undefined,
    entryDate: undefined,
    job: undefined,
    salary: undefined,
    exprList: [],
  });

  // 动态经历
  const addExpr = () =>
    setForm((f) => ({
      ...f,
      exprList: [
        ...(f.exprList ?? []),
        { company: "", job: "", begin: "", end: "" },
      ],
    }));

  const removeExpr = (idx: number) =>
    setForm((f) => ({
      ...f,
      exprList: (f.exprList ?? []).filter((_, i) => i !== idx),
    }));

  const updateExpr = (idx: number, patch: Partial<EmpExpr>) =>
    setForm((f) => ({
      ...f,
      exprList: (f.exprList ?? []).map((e, i) =>
        i === idx ? { ...e, ...patch } : e
      ),
    }));

  const isYMD = (s?: string) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
  const isHttpUrl = (s?: string) => {
    if (!s) return false;
    try {
      const u = new URL(s);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!form.phone?.trim()) throw new Error("phone is required");
      // 如果你想更严格：if (!/^1\d{10}$/.test(form.phone.trim())) throw new Error("invalid phone");
      // 简单必填校验
      if (!form.username?.trim()) throw new Error("username is required");
      if (!form.name?.trim()) throw new Error("name is required");
      if (![1, 2].includes(Number(form.gender)))
        throw new Error("gender must be 1 or 2");

      const payload: EmpCreate = {
        username: form.username.trim(),
        name: form.name.trim(),
        gender: Number(form.gender),
        phone: form.phone.trim(), // ← 关键
        image: isHttpUrl(form.image) ? form.image : undefined,
        deptId: form.deptId ? Number(form.deptId) : undefined,
        job: form.job ? Number(form.job) : undefined,
        salary: form.salary ? Number(form.salary) : undefined,
        entryDate: isYMD(form.entryDate) ? form.entryDate : undefined,
        exprList: (form.exprList ?? [])
          .filter((e) => e.company || e.job || e.begin || e.end)
          .map((e) => ({
            company: e.company || undefined,
            job: e.job || undefined,
            begin: isYMD(e.begin) ? e.begin : undefined,
            end: isYMD(e.end) ? e.end : undefined,
          })),
      };

      await createEmployee(payload);
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "保存失败");
    },
    onSuccess: () => {
      toast.success("Successfully added 🎉");
      // 刷新员工列表
      qc.invalidateQueries({ queryKey: ["emps"] }); // 刷新列表
      setOpen(false);
      // 重置表单
      setForm({
        username: "",
        name: "",
        gender: 1,
        phone: "",
        image: "",
        deptId: undefined,
        entryDate: undefined,
        job: undefined,
        salary: undefined,
        exprList: [],
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Add New Employee</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* username */}
          <div className="space-y-1">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              placeholder="e.g., linpingzhi"
              required
            />
          </div>

          {/* name */}
          <div className="space-y-1">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., 林平之"
              required
            />
          </div>

          {/* gender */}
          <div className="space-y-1">
            <Label htmlFor="gender">Gender *</Label>
            <select
              id="gender"
              className="border px-3 py-2 rounded w-full"
              value={String(form.gender ?? 1)}
              onChange={(e) =>
                setForm((f) => ({ ...f, gender: Number(e.target.value) }))
              }
            >
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>

          {/* phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="e.g., 15522261717"
              inputMode="tel"
              required
            />
          </div>

          {/* job */}
          <div className="space-y-1">
            <Label htmlFor="job">Job (1..5)</Label>
            <Input
              id="job"
              type="number"
              min={1}
              max={5}
              value={form.job ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  job: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              placeholder="1=班主任, 2=讲师, 3=学工主管, 4=教研主管, 5=咨询师"
            />
          </div>

          {/* deptId */}
          <div className="space-y-1">
            <Label htmlFor="deptId">Dept ID</Label>
            <Input
              id="deptId"
              type="number"
              value={form.deptId ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  deptId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              placeholder="e.g., 1"
            />
          </div>

          {/* entryDate */}
          <div className="space-y-1">
            <Label htmlFor="entryDate">Entry Date</Label>
            <Input
              id="entryDate"
              type="date"
              value={form.entryDate ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  entryDate: e.target.value || undefined,
                }))
              }
            />
          </div>

          {/* salary */}
          <div className="space-y-1">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              value={form.salary ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  salary: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              placeholder="e.g., 8000"
            />
          </div>

          {/* image */}
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="image">Avatar URL</Label>
            <Input
              id="image"
              value={form.image ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>
        </div>

        {/* 工作经历列表 */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Work Experience</h4>
            <Button type="button" variant="outline" onClick={addExpr}>
              + Add Experience
            </Button>
          </div>

          {(form.exprList ?? []).map((ex, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border p-3 rounded"
            >
              <div className="space-y-1">
                <Label>Company</Label>
                <Input
                  value={ex.company ?? ""}
                  onChange={(e) => updateExpr(idx, { company: e.target.value })}
                  placeholder="公司"
                />
              </div>
              <div className="space-y-1">
                <Label>Job</Label>
                <Input
                  value={ex.job ?? ""}
                  onChange={(e) => updateExpr(idx, { job: e.target.value })}
                  placeholder="职位"
                />
              </div>
              <div className="space-y-1">
                <Label>Begin</Label>
                <Input
                  type="date"
                  value={ex.begin ?? ""}
                  onChange={(e) => updateExpr(idx, { begin: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>End</Label>
                <Input
                  type="date"
                  value={ex.end ?? ""}
                  onChange={(e) => updateExpr(idx, { end: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeExpr(idx)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
