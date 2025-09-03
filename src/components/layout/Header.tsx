"use client";

export default function Header() {
  return (
    <header className="h-14 bg-gray-800 text-white flex items-center justify-between px-4">
      {/* 左侧 Logo / 标题 */}
      <div className="font-bold">CleverPath</div>

      {/* 右侧按钮 */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => alert("修改密码功能待实现")}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          修改密码
        </button>
        <button
          onClick={() => alert("退出登录功能待实现")}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          退出登录
        </button>
      </div>
    </header>
  );
}
