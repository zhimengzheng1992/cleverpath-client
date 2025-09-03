// src/lib/utils/date.ts

/**
 * toYMD 支持两种输入：
 * 1) Date|null  → string（null 返回 ""）【兼容旧用法】
 * 2) string|undefined → 原样返回（用于 <input type="date"> 的值）
 */
export function toYMD(d: Date | null): string;
export function toYMD(d: string | undefined): string | undefined;
export function toYMD(d: any): any {
  if (!d) return d instanceof Date ? "" : d; // Date|null → ""；string|undefined → 原样返回
  if (d instanceof Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  // string: 假设已是 "YYYY-MM-DD"（<input type="date"> 即如此），直接透传
  return d as string;
}

/** 把 ISO 或 "YYYY-MM-DD" 友好地格式化成 "MMM d, yyyy"（本地化） */
export const formatDate = (isoLike: string) => {
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return isoLike;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
