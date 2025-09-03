"use client";
import { Button } from "@/components/ui/button";
import type { EmpRow } from "@/types/emp";
import { formatDate } from "@/lib/date";
import { genderText, jobTitleMap } from "@/types/emp";

type Props = {
  rows: EmpRow[];
  selected: Set<number>;
  onToggleOne: (id: number) => void;
  onToggleAll: () => void;
  isFetching: boolean;
  isInitialLoading: boolean;
  pageSize: number;
  total: number;
  onDeleteOne?: (id: number) => void;
  onEditOne?: (row: EmpRow) => void;
};

export default function EmployeeTable({
  rows,
  selected,
  onToggleOne,
  onToggleAll,
  isFetching,
  isInitialLoading,
  pageSize,
  total,
  onDeleteOne,
  onEditOne,
}: Props) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="flex items-center justify-between px-6 h-14">
        <h2 className="text-xl font-bold">Employee List</h2>
        <div className="text-sm text-gray-600">
          Total: <span className="font-medium">{total}</span>
        </div>
      </div>

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
                    onChange={onToggleAll}
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
                        onChange={() => onToggleOne(emp.id)}
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
                        <div className="h-9 w-9 rounded-full bg-gray-200 grid place-items-center text-xs text-gray-600">
                          {(
                            emp.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2) || "NA"
                          ).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">{emp.deptName}</td>
                    <td className="px-6 py-3">
                      {jobTitleMap[emp.job] ?? `Job #${emp.job}`}
                    </td>
                    <td className="px-6 py-3">{formatDate(emp.entryDate)}</td>
                    <td className="px-6 py-3">{formatDate(emp.updateTime)}</td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => onEditOne?.(emp)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => onDeleteOne?.(emp.id)}
                        >
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

        {isFetching && !isInitialLoading && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Loading…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
