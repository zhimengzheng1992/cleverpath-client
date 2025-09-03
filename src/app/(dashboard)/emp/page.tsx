"use client";

import { Button } from "@/components/ui/button";
import DateRangeInput from "@/components/ui/DateRangeInput";
import axios from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StableSelect from "@/components/ui/stable-select";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

type EmpRow = {
  id: number;
  username: string;
  password?: string;
  name: string;
  gender: number; // 0/1/2 等
  job: number; // 职位枚举（后端定义）
  salary?: number;
  image?: string; // 头像 URL
  entryDate: string; // "YYYY-MM-DD"
  deptId: number;
  deptName: string;
  createTime: string; // ISO
  updateTime: string; // ISO
};

type EmpsData = { total: number; rows: EmpRow[] };

const jobTitleMap: Record<number, string> = {
  0: "Staff",
  1: "Engineer",
  2: "Senior Engineer",
  3: "Lead",
  4: "Manager",
  5: "Director",
};

const genderText = (g: number) =>
  g === 1 ? "Male" : g === 2 ? "Female" : "Other";

const formatDate = (isoLike: string) => {
  // 支持 "2025-09-02" 或 ISO 字符串
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return isoLike;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const toYMD = (d: Date | null) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`
    : "";

export default function EmployeePage() {
  // Filters
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  // Table & pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [gotoInput, setGotoInput] = useState<string>("");

  const queryClient = useQueryClient();

  // ✅ 用“原始值”组装 queryKey（不要把 object 放进去）
  const begin = startDate ? toYMD(startDate) : "";
  const end = endDate ? toYMD(endDate) : "";
  const _name = name.trim();
  const _gender = gender;

  const queryKey = ["emps", page, pageSize, _name, _gender, begin, end];

  // --- 查询函数（接入你的 axios；react-query 会注入 signal） ---
  // 查询函数（react-query 会注入 signal）
  const queryFn = ({ signal }: { signal?: AbortSignal }) =>
    axios.get<EmpsData>("/emps", {
      signal,
      params: {
        page,
        pageSize,
        name: _name || undefined,
        gender: _gender || undefined,
        begin: begin || undefined,
        end: end || undefined,
      },
    });

  const {
    data, // { total, rows }
    error,
    isInitialLoading,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData, // 保留上一页数据，避免闪屏
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const displayPage = Math.min(Math.max(1, page), totalPages);

  // ✅ 预取下一页（依赖只写“原始值”）
  useEffect(() => {
    if (page < totalPages) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: ["emps", nextPage, pageSize, _name, _gender, begin, end],
        queryFn: ({ signal }) =>
          axios.get<EmpsData>("/emps", {
            signal,
            params: {
              page: nextPage,
              pageSize,
              name: _name || undefined,
              gender: _gender || undefined,
              begin: begin || undefined,
              end: end || undefined,
            },
          }),
        staleTime: 30_000,
      });
    }
  }, [page, pageSize, _name, _gender, begin, end, totalPages, queryClient]);

  // 选择框（当前页）
  const allIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const allChecked = selected.size > 0 && selected.size === rows.length;
  const indeterminate = selected.size > 0 && selected.size < rows.length;
  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(allIds));
  };
  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 翻页/筛选时清理不在当前页的选择
  useEffect(() => {
    setSelected((prev) => {
      const curr = new Set<number>();
      for (const id of allIds) if (prev.has(id)) curr.add(id);
      return curr;
    });
  }, [allIds]);

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // 改筛选回到第 1 页；react-query 会自动 refetch
  };
  const handleReset = () => {
    setName("");
    setGender("");
    setDateRange([null, null]);
    setPage(1);
  };
  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setPage(1);
  };
  const handlePageSelect = (val: string) => setPage(Number(val));
  const handleGoToPage = () => {
    const n = Number(gotoInput);
    if (!Number.isFinite(n)) return;
    setPage(Math.min(Math.max(1, n), totalPages));
  };
  const removeSelected = async () => {
    if (selected.size === 0) return;
    // TODO：后端 DELETE /emps?ids=1,2,3
    // 做到最佳：调用后端成功后，用 queryClient.invalidateQueries({ queryKey: ["emps"] })
    // 这里只做前端演示（不推荐生产使用）
    // queryClient.setQueryData<EmpsData>(queryKey, (old) =>
    //   old ? { ...old, rows: old.rows.filter((r) => !selected.has(r.id)), total: old.total - selected.size } : old
    // );
    setSelected(new Set());
  };

  // A) 勾选集同步，避免无变化 setState
  useEffect(() => {
    setSelected((prev) => {
      const next = new Set<number>();
      for (const id of allIds) if (prev.has(id)) next.add(id);

      if (next.size === prev.size) {
        for (const id of next) if (!prev.has(id)) return next;
        return prev;
      }
      return next;
    });
  }, [allIds]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <p>Here you can manage all employees...</p>

      {/* Filters */}
      <div className="bg-white p-6 rounded shadow">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="border px-3 py-2 rounded w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border px-3 py-2 rounded w-40"
            >
              <option value="">All</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="0">Other</option>
            </select>
          </div>

          <DateRangeInput value={dateRange} onChange={setDateRange} />

          <div className="flex gap-3 ml-auto">
            <Button type="submit">Search</Button>
            <Button type="button" variant="destructive" onClick={handleReset}>
              Clear
            </Button>
          </div>
        </form>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-6 rounded shadow space-x-4">
        <Button type="button">Add New Employee</Button>
        <Button type="button" variant="destructive" onClick={removeSelected}>
          Delete Selected
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="flex items-center justify-between px-6 h-14">
          <h2 className="text-xl font-bold">Employee List</h2>
          <div className="flex items-center gap-2">
            {isFetching && !isInitialLoading && (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading…
              </span>
            )}
            <div className="text-sm text-gray-600">
              Total: <span className="font-medium">{total}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 pb-2 text-red-600 text-sm">
            {String((error as any)?.message || error)}
          </div>
        )}

        {/* 表格容器：保留旧数据；加载时轻微淡化 */}
        <div className="relative">
          <div
            className="overflow-x-auto transition-opacity duration-150"
            style={{ opacity: isFetching && !isInitialLoading ? 0.6 : 1 }}
          >
            <table className="w-full table-auto text-sm min-w-[1000px]">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 w-[48px]">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={rows.length > 0 && selected.size === rows.length}
                      ref={(el) => {
                        if (el)
                          el.indeterminate =
                            selected.size > 0 && selected.size < rows.length;
                      }}
                      onChange={toggleAll}
                      className="size-4"
                    />
                  </th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Gender</th>
                  <th className="px-6 py-3">Avatar</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Hire Date</th>
                  <th className="px-6 py-3">Last Updated</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isInitialLoading ? (
                  // 首屏骨架：保留表格高度，避免跳变
                  Array.from({ length: pageSize }).map((_, i) => (
                    <tr key={`sk-${i}`} className="border-t">
                      <td className="px-6 py-3" colSpan={9}>
                        <div className="h-5 w-full animate-pulse bg-gray-200 rounded" />
                      </td>
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  rows.map((emp) => (
                    <tr key={emp.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          aria-label={`Select ${emp.name}`}
                          checked={selected.has(emp.id)}
                          onChange={() => toggleOne(emp.id)}
                          className="size-4"
                        />
                      </td>
                      <td className="px-6 py-3 font-medium">{emp.name}</td>
                      <td className="px-6 py-3">{genderText(emp.gender)}</td>
                      <td className="px-6 py-3">
                        {emp.image ? (
                          <img
                            src={emp.image}
                            alt={`${emp.name} avatar`}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-600">
                              {emp.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "NA"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3">{emp.deptName}</td>
                      <td className="px-6 py-3">
                        {jobTitleMap[emp.job] ?? `Job #${emp.job}`}
                      </td>
                      <td className="px-6 py-3">{formatDate(emp.entryDate)}</td>
                      <td className="px-6 py-3">
                        {formatDate(emp.updateTime)}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => alert(`Edit ${emp.name}`)}
                          >
                            Edit
                          </Button>
                          <Button type="button" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 可选：覆盖式 Loading；你也可以只用上面右上角的小 spinner */}
          {isFetching && !isInitialLoading && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination（shadcn 版本） */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 h-16 border-t md:flex-nowrap">
        <div className="flex items-center gap-2 shrink-0">
          <span className="whitespace-nowrap text-sm">Rows per page</span>
          <StableSelect
            value={String(pageSize)}
            onChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
            options={[5, 10, 15, 20].map((n) => ({ value: String(n) }))}
            triggerClassName="w-[88px] shrink-0"
          />
        </div>

        <div className="flex items-center gap-3 text-sm shrink-0 flex-wrap md:flex-nowrap">
          <span className="text-muted-foreground shrink-0">
            Total: <span className="font-medium text-foreground">{total}</span>
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <span className="shrink-0">Page</span>
            <StableSelect
              value={String(displayPage)}
              onChange={(v) => setPage(Number(v))}
              options={Array.from({ length: totalPages }, (_, i) => ({
                value: String(i + 1),
              }))}
              triggerClassName="w-[88px] shrink-0"
              contentClassName="max-h-64"
              resetKey={totalPages}
            />
            <span className="text-muted-foreground shrink-0">
              / {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Label htmlFor="gotoPage" className="shrink-0">
              Go to
            </Label>
            <Input
              id="gotoPage"
              type="number"
              min={1}
              max={totalPages}
              value={gotoInput}
              onChange={(e) => setGotoInput(e.target.value)}
              className="w-20 shrink-0"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGoToPage}
              disabled={isFetching}
              className="shrink-0"
            >
              Go
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
