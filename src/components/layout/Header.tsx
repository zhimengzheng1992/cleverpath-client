"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// ✅ 确认弹窗组件（shadcn）
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type LoginUser = {
  id: number;
  username: string;
  name?: string;
  token: string;
};

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<LoginUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("loginUser");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginUser");
    router.replace("/login");
  };

  const initials = (
    user?.name?.trim()?.[0] ||
    user?.username?.trim()?.[0] ||
    "?"
  ).toUpperCase();

  return (
    <header className="h-14 bg-gray-800 text-white flex items-center justify-between px-4">
      <div className="font-bold">CleverPath</div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => alert("修改密码功能待实现")}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Update Password
        </button>

        {/* ✅ 退出按钮包一层 AlertDialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
              Sign Out
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[420px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                You’ll need to sign in again to continue using the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
              >
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 用户信息（头像“宋”为黑字） */}
        {user && (
          <div className="flex items-center pl-3 ml-1 border-l border-white/20">
            <div
              className="w-8 h-8 mr-2 grid place-items-center rounded-full bg-white text-black text-sm font-medium"
              title={user.username}
            >
              {initials /* 这里通常是“宋” */}
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium">
                {user.name || user.username}
              </div>
              <div className="text-xs text-white/70">@{user.username}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
