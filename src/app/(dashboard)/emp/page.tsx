"use client";

import DateRangeInput from "@/components/ui/DateRangeInput";
import { useState } from "react";

export default function EmployeePage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search with:", { name, gender, startDate, endDate });
    // TODO: 调用后端 API
  };

  const handleReset = () => {
    setName("");
    setGender("");
    setDateRange([null, null]);
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <p>Here you can manage all employees...</p>
      <div className="bg-white p-6 rounded shadow">
        {/* 🔍 搜索栏 */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-center gap-4"
        >
          {/* 姓名 */}
          <div className="flex items-center space-x-2">
            <label className="text-s font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="border px-3 py-2 rounded w-48"
            />
          </div>

          {/* 性别 */}
          <div className="flex items-center space-x-2">
            <label className="text-s font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border px-3 py-2 rounded w-32"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* 入职时间 */}
          <DateRangeInput />

          {/* 按钮组 */}
          <div className="flex space-x-4 mx-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white p-6 rounded shadow">Button</div>
    </div>
  );
}
