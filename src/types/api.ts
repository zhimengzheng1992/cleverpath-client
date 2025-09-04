export type ApiResponse<T> = {
  code: number;
  data: T;
  msg: string;
};
