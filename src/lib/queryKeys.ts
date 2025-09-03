export const qk = {
  emps: (
    page: number,
    pageSize: number,
    name: string,
    gender: string,
    begin: string,
    end: string
  ) => ["emps", page, pageSize, name, gender, begin, end] as const,
};
