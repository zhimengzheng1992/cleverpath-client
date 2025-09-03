// src/components/ui/stable-select.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label?: string;
  disabled?: boolean;
};

export default function StableSelect({
  value,
  onChange,
  options,
  placeholder,
  id,
  triggerClassName,
  // 为了兼容你现有的调用，这两个参数接受但不使用或仅作 key
  contentClassName, // eslint-disable-line @typescript-eslint/no-unused-vars
  resetKey,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  id?: string;
  triggerClassName?: string;
  contentClassName?: string;
  resetKey?: React.Key;
}) {
  return (
    <select
      key={resetKey}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        // 尽量贴近 shadcn 的 <SelectTrigger> 外观
        "flex h-9 w-fit items-center rounded-md border border-input bg-background px-3 py-2 text-sm",
        "shadow-xs outline-none transition-[color,box-shadow]",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "data-[placeholder]:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "whitespace-nowrap", // 防止被压扁换行
        triggerClassName
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label ?? opt.value}
        </option>
      ))}
    </select>
  );
}
