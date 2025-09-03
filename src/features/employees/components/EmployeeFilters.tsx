"use client";
import { Button } from "@/components/ui/button";
import DateRangeInput from "@/components/ui/DateRangeInput";
import { useState } from "react";

type Props = {
  defaultName?: string;
  defaultGender?: string;
  onSubmit: (v: {
    name: string;
    gender: string;
    dateRange: [Date | null, Date | null];
  }) => void;
  onReset: () => void;
};

export default function EmployeeFilters({
  defaultName = "",
  defaultGender = "",
  onSubmit,
  onReset,
}: Props) {
  const [name, setName] = useState(defaultName);
  const [gender, setGender] = useState(defaultGender);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ name, gender, dateRange });
        }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="border px-3 py-2 rounded w-48"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border px-3 py-2 rounded w-40"
          >
            <option value="">All</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
            <option value="0">Other</option>
          </select>
        </div>

        <DateRangeInput value={dateRange} onChange={setDateRange} />

        <div className="flex gap-3 ml-auto">
          <Button type="submit">Search</Button>
          <Button type="button" variant="destructive" onClick={onReset}>
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}
