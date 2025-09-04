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

export type EmpsQuery = {
  page: number;
  pageSize: number;
  name?: string;
  gender?: string;
  begin?: string;
  end?: string;
};

// 后端 data 里的详情类型（比列表更全）
export type EmpDetail = EmpRow & {
  username: string;
  image?: string | null;
  deptId?: number | null;
  entryDate?: string | null;
  job?: number | null;
  salary?: number | null;
  exprList?: Array<{
    id?: number | null;
    company?: string | null;
    job?: string | null;
    begin?: string | null;
    end?: string | null;
    empId?: number | null;
  }> | null;
};

// 更新的请求体（与接口文档一致）
export type EmpUpdate = {
  id: number;
  username: string;
  name: string;
  gender: number; // 1/2
  image?: string;
  deptId?: number;
  entryDate?: string; // YYYY-MM-DD
  job?: number;
  salary?: number;
  exprList?: Array<{
    id?: number;
    company?: string;
    job?: string;
    begin?: string; // YYYY-MM-DD
    end?: string; // YYYY-MM-DD
    empId?: number;
  }>;
};
