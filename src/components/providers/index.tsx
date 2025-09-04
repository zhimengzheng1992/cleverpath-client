"use client";

import QueryProvider from "./QueryProvider";
import ToastProvider from "./ToastProvider";
// 可选：不需要主题就删除下一行与组件

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {/* 主题可选；若不用，删掉这一层 */}
      {/* Toaster 全局唯一且跨路由持久化 */}
      <ToastProvider />
      {children}
    </QueryProvider>
  );
}
