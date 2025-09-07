"use client";

import React, { useMemo, useState } from "react";
import api from "@/lib/axios";
import AppDialog from "@/components/ui/Dialog1";
import toast from "react-hot-toast";

interface Department {
  id: number;
  name: string;
  createTime: string;
  updateTime: string;
}

interface PaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRows: number) => void;
}

function Pagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) {
  const totalPages =
    rowsPerPage > 0 ? Math.max(1, Math.ceil(count / rowsPerPage)) : 1;

  const go = (p: number) =>
    onPageChange(Math.min(Math.max(0, p), totalPages - 1));

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t">
      <div className="flex items-center space-x-2">
        <span className="text-sm">Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[5, 10, 25].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
          <option value={-1}>All</option>
        </select>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => go(0)}
          disabled={page === 0}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ⏮
        </button>
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ◀
        </button>
        <span className="text-sm px-2">
          {Math.min(page + 1, totalPages)} / {totalPages}
        </span>
        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages - 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ▶
        </button>
        <button
          onClick={() => go(totalPages - 1)}
          disabled={page >= totalPages - 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ⏭
        </button>
      </div>

      <div className="text-sm">
        {rowsPerPage === -1
          ? `1–${count} of ${count}`
          : `${count === 0 ? 0 : page * rowsPerPage + 1}–${Math.min(
              (page + 1) * rowsPerPage,
              count
            )} of ${count}`}
      </div>
    </div>
  );
}

export default function DeptTable({
  data,
  onRefresh,
}: {
  data: Department[];
  onRefresh: () => void;
}) {
  // 防御：保证 data 是数组
  const list = Array.isArray(data) ? data : [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);

  const totalRows = list.length;

  // 当修改 rowsPerPage 时，保证 page 不越界
  const totalPages = useMemo(
    () =>
      rowsPerPage > 0 ? Math.max(1, Math.ceil(totalRows / rowsPerPage)) : 1,
    [totalRows, rowsPerPage]
  );
  const safePage = Math.min(page, totalPages - 1);

  const paginatedData =
    rowsPerPage > 0
      ? list.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage)
      : list;

  const handleDelete = async () => {
    if (!deletingDept) return;
    try {
      const resp = await api.delete("/depts", {
        params: { id: deletingDept.id },
      });
      // 假设 resp 是 { code, msg, data }（与你 axios 拦截器匹配）
      if (resp.data?.code !== 200)
        throw new Error(resp.data?.msg || "Delete failed");
      setDeletingDept(null);
      onRefresh();
      toast.success("Department deleted successfully");
    } catch (err: any) {
      toast.error("Delete failed: " + (err?.message || err));
    }
  };

  const handleSave = async () => {
    if (!editingDept) return;
    try {
      const resp = await api.put("/depts", {
        id: editingDept.id,
        name: editingDept.name,
      });
      if (resp.data?.code !== 200)
        throw new Error(resp.data?.msg || "Update failed");
      setEditingDept(null);
      onRefresh();
      toast.success("Department updated successfully");
    } catch (err: any) {
      toast.error("Update failed: " + (err?.message || err));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th className="px-6 py-3 border-b">ID</th>
            <th className="px-6 py-3 border-b">Department Name</th>
            <th className="px-6 py-3 border-b">Create Time</th>
            <th className="px-6 py-3 border-b">Update Time</th>
            <th className="px-6 py-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-600">
          {paginatedData.map((dept) => (
            <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3 border-b">{dept.id}</td>
              <td className="px-6 py-3 border-b">{dept.name}</td>
              <td className="px-6 py-3 border-b">
                {new Date(dept.createTime).toLocaleString()}
              </td>
              <td className="px-6 py-3 border-b">
                {new Date(dept.updateTime).toLocaleString()}
              </td>
              <td className="px-6 py-3 border-b space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => setEditingDept(dept)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => setDeletingDept(dept)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td className="px-6 py-6 text-center text-gray-500" colSpan={5}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        count={totalRows}
        page={safePage}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRows) => {
          setRowsPerPage(newRows);
          setPage(0);
        }}
      />

      {/* Edit Dialog */}
      <AppDialog
        isOpen={!!editingDept}
        title="Edit Department"
        onClose={() => setEditingDept(null)}
        onConfirm={handleSave}
        confirmText="Save"
      >
        {/* 用本地变量避免在 setState 时直接展开 null */}
        <input
          className="border p-2 w-full"
          value={editingDept ? editingDept.name : ""}
          onChange={(e) =>
            setEditingDept((prev) =>
              prev ? { ...prev, name: e.target.value } : prev
            )
          }
        />
      </AppDialog>

      {/* Delete Dialog */}
      <AppDialog
        isOpen={!!deletingDept}
        title="Delete Department"
        onClose={() => setDeletingDept(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      >
        <p>
          Are you sure you want to delete{" "}
          <span className="font-bold">{deletingDept?.name}</span>?
        </p>
      </AppDialog>
    </div>
  );
}
