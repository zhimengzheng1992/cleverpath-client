// src/app/(dashboard)/layout.tsx

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      {/* 顶部 Header */}
      <div className="shrink-0">
        <Header />
      </div>

      <div className="flex flex-1 min-h-0">
        {/* 左侧菜单 */}
        <Sidebar />

        {/* 右侧主内容区 */}
        <main className="flex-1 p-6 overflow-y-auto relative min-w-0 min-h-0">
          {/* ✅ Toast 只渲染在 main 区域 */}
          <Toaster
            position="top-center"
            containerClassName="!absolute !left-1/2 !transform !-translate-x-1/2 !top-4"
            toastOptions={{ className: "z-[9999]" }} // 防止被遮
          />
          {children}
        </main>
      </div>
    </div>
  );
}
