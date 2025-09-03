"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import DeptTable from "@/components/ui/DeptTable";
import api from "@/lib/axios";
import AppDialog from "@/components/ui/Dialog"; // ✅ 引入统一Dialog
import toast from "react-hot-toast";

interface Department {
  id: number;
  name: string;
  createTime: string;
  updateTime: string;
}

export default function DeptPage() {
  const [data, setData] = useState<Department[]>([]);
  const [isAdding, setIsAdding] = useState(false); // ✅ 控制新增弹窗
  const [newDeptName, setNewDeptName] = useState(""); // ✅ 新部门名称

  // 加载部门列表
  const fetchData = async () => {
    try {
      const res = await api.get<Department[]>("/depts"); // ✅ GET /depts
      setData(res);
    } catch (err: any) {
      toast.error("Failed to fetch departments: " + (err.message || err));
    }
  };

  // 新增部门
  const handleAdd = async () => {
    if (!newDeptName.trim()) {
      toast.error("Department name cannot be empty!");
      return;
    }
    try {
      await api.post("/depts", { name: newDeptName }); // ✅ 调用 POST /depts
      toast.success("Department added successfully!");
      setNewDeptName("");
      setIsAdding(false);
      fetchData(); // 刷新列表
    } catch (err: any) {
      toast.error("Failed to add department: " + (err.message || err));
    }
  };

  // 页面加载时拉取一次
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Department Management</h1>
      <p>Here you can manage all departments...</p>

      <div className="mt-4">
        <Button onClick={() => setIsAdding(true)}>+ Add new department</Button>

        <div className="mt-4">
          {/* ✅ 把数据传给表格，并传 onRefresh 回调 */}
          <DeptTable data={data} onRefresh={fetchData} />
        </div>
      </div>

      {/* ✅ 新增部门的对话框 */}
      <AppDialog
        isOpen={isAdding}
        title="Add Department"
        onClose={() => setIsAdding(false)}
        onConfirm={handleAdd}
        confirmText="Create"
      >
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Enter department name"
          value={newDeptName}
          onChange={(e) => setNewDeptName(e.target.value)}
        />
      </AppDialog>
    </div>
  );
}
