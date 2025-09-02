"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/dashboard/home", label: "Home" },
  { href: "/dashboard/reports", label: "Reports" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-gray-100 border-r">
      <nav className="flex flex-col p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`p-2 rounded hover:bg-gray-200 ${
              pathname === item.href ? "bg-gray-300 font-bold" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
