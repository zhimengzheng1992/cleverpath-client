"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface DateRangeInputProps {
  value: [Date | null, Date | null];
  onChange: (range: [Date | null, Date | null]) => void;
}

export default function DateRangeInput({
  value,
  onChange,
}: DateRangeInputProps) {
  const [startDate, endDate] = value;

  return (
    <div className="flex items-center space-x-2">
      <label className="text-s font-medium text-gray-700">Hire Date</label>
      <div className="flex items-center border rounded px-2 py-1 bg-white">
        {/* 开始日期 */}
        <DatePicker
          selected={startDate}
          onChange={(date) => onChange([date, endDate])}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="start date"
          className="outline-none px-2 py-1 w-24"
        />

        {/* 固定分隔符 👉 始终显示 */}
        <span className="text-gray-700 px-2">TO</span>

        {/* 结束日期 */}
        <DatePicker
          selected={endDate}
          onChange={(date) => onChange([startDate, date])}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || undefined}
          placeholderText="end date"
          className="outline-none px-2 py-1 w-24"
        />
      </div>
    </div>
  );
}
