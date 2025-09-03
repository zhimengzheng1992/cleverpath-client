export type EmpRow = {
  id: number;
  username: string;
  password?: string;
  name: string;
  gender: number;
  job: number;
  salary?: number;
  image?: string;
  entryDate: string;
  deptId: number;
  deptName: string;
  createTime: string;
  updateTime: string;
};

export type EmpsData = { total: number; rows: EmpRow[] };

export const jobTitleMap: Record<number, string> = {
  0: "Staff",
  1: "Engineer",
  2: "Senior Engineer",
  3: "Lead",
  4: "Manager",
  5: "Director",
};

export const genderText = (g: number) =>
  g === 1 ? "Male" : g === 2 ? "Female" : "Other";

export type EmpExpr = {
  company?: string;
  job?: string;
  begin?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
};

export type EmpCreate = {
  username: string;
  name: string;
  gender: number; // 1 男, 2 女
  phone: string;
  image?: string;
  deptId?: number;
  entryDate?: string; // YYYY-MM-DD
  job?: number; // 1..5
  salary?: number;
  exprList?: EmpExpr[];
};
