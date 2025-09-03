"use client";

import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";
import { toYMD } from "@/lib/date";
import { useEmpsQuery } from "@/features/employees/hooks/useEmpsQuery";
import EmployeeFilters from "@/features/employees/components/EmployeeFilters";
import EmployeeTable from "@/features/employees/components/EmployeeTable";
import EmployeePagination from "@/features/employees/components/EmployeePagination";
import type { EmpRow } from "@/types/emp";
import { deleteEmployees } from "@/services/emps";
import AddEmployeeDialog from "@/features/employees/components/AddEmployeeDialog";
import { useConfirmDelete } from "@/components/ui/ConfirmDelete";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import EditEmployeeDialog from "@/features/employees/components/EditEmployeeDialog";

export default function EmployeePage() {
  // filters
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  // table & pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const begin = dateRange[0] ? toYMD(dateRange[0]) : "";
  const end = dateRange[1] ? toYMD(dateRange[1]) : "";

  const { data, error, isInitialLoading, isFetching } = useEmpsQuery({
    page,
    pageSize,
    name,
    gender,
    begin,
    end,
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  // 删除 mutation
  const qc = useQueryClient();
  const { mutateAsync: removeEmps } = useMutation({
    mutationFn: (ids: number[]) => deleteEmployees(ids),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "emps",
      });
    },
  });

  const { confirm, ConfirmDialog } = useConfirmDelete();

  // 当前页 id 列表（用于全选/反选）
  const allIds = useMemo(() => rows.map((r) => r.id), [rows]);
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
  useEffect(() => {
    setSelected((prev) => {
      const next = new Set<number>();
      for (const id of allIds) if (prev.has(id)) next.add(id);
      if (next.size === prev.size) {
        // 逐个比一下，完全一样就不更新
        for (const id of next) if (!prev.has(id)) return next;
        return prev; // 不变就返回原引用，避免重渲染
      }
      return next;
    });
  }, [allIds]);

  // handlers
  const onSubmitFilters = ({
    name,
    gender,
    dateRange,
  }: {
    name: string;
    gender: string;
    dateRange: [Date | null, Date | null];
  }) => {
    setName(name);
    setGender(gender);
    setDateRange(dateRange);
    setPage(1);
  };
  const onResetFilters = () => {
    setName("");
    setGender("");
    setDateRange([null, null]);
    setPage(1);
  };

  // 批量删除触发
  const onDeleteSelected = (ids: number[]) => {
    if (ids.length === 0) return toast.error("Please select at least one row");
    confirm(ids, "Delete Employees");
  };

  // 单条删除触发
  const onDeleteOne = (id: number) => {
    confirm([id], "Delete Employee");
  };

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  // 表格里的 Edit 点击
  const onEditOne = (row: EmpRow) => {
    setEditId(row.id);
    setEditOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <p>Here you can manage all employees...</p>
      {/* 传入真正的删除逻辑 */}
      <ConfirmDialog onConfirm={(ids) => removeEmps(ids)} />

      <EmployeeFilters onSubmit={onSubmitFilters} onReset={onResetFilters} />

      <div className="bg-white p-6 rounded shadow space-x-4">
        {/* <Button type="button">Add New Employee</Button> */}
        <AddEmployeeDialog />
        <Button
          type="button"
          variant="destructive"
          onClick={() => onDeleteSelected([...selected])}
        >
          Delete Selected
        </Button>
      </div>

      {error && (
        <div className="px-6 pb-2 text-red-600 text-sm">
          {String((error as any)?.message || error)}
        </div>
      )}

      <EmployeeTable
        rows={rows}
        selected={selected}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        isFetching={isFetching}
        isInitialLoading={isInitialLoading}
        pageSize={pageSize}
        total={total}
        onEditOne={onEditOne}
        onDeleteOne={onDeleteOne}
      />

      {/* Edit 弹窗 */}
      <EditEmployeeDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        id={editId}
      />

      <EmployeePagination
        page={page}
        pageSize={pageSize}
        total={total}
        isFetching={isFetching}
        onChangePage={setPage}
        onChangePageSize={setPageSize}
      />
    </div>
  );
}
