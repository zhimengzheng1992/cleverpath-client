"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/index", label: "Home" },
  {
    label: "Class & Student Management",
    children: [
      { href: "/classes", label: "Class Management" },
      { href: "/students", label: "Student Management" },
    ],
  },
  {
    label: "System Information Management",
    children: [
      { href: "/dept", label: "Department Management" },
      { href: "/emp", label: "Employee Management" },
    ],
  },
  {
    label: "Data Statistics",
    children: [
      { href: "/dashboard/employee-stats", label: "Employee Statistics" },
      { href: "/dashboard/student-stats", label: "Student Statistics" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-60 bg-gray-100 border-r">
      <nav className="flex flex-col p-4 space-y-2">
        {menu.map((item) =>
          item.children ? (
            <div key={item.label}>
              {/* Top-level menu with collapsible children */}
              <button
                onClick={() => toggleMenu(item.label)}
                className={`w-full text-left p-2 rounded hover:bg-gray-200 flex justify-between items-center ${
                  openMenus[item.label] ? "bg-gray-300 font-bold" : ""
                }`}
              >
                <span>{item.label}</span>
                <span>{openMenus[item.label] ? "▲" : "▼"}</span>
              </button>

              {/* Sub-menu */}
              {openMenus[item.label] && (
                <div className="ml-4 mt-1 flex flex-col space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`p-2 rounded hover:bg-gray-200 ${
                        pathname === child.href ? "bg-gray-300 font-bold" : ""
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Normal top-level menu
            <Link
              key={item.href}
              href={item.href!}
              className={`p-2 rounded hover:bg-gray-200 ${
                pathname === item.href ? "bg-gray-300 font-bold" : ""
              }`}
            >
              {item.label}
            </Link>
          )
        )}
      </nav>
    </aside>
  );
}
