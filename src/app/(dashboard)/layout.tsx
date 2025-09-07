// src/app/(dashboard)/layout.tsx  — Server Component（不要写 "use client"）
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // ✅ await
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login"); // ✅ 首屏服务端重定向，无闪烁
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="shrink-0">
        <Header />
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto relative min-w-0 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
