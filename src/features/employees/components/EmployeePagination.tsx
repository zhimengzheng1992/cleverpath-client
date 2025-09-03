"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StableSelect from "@/components/ui/stable-select";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  isFetching: boolean;
  onChangePage: (p: number) => void;
  onChangePageSize: (s: number) => void;
};

export default function EmployeePagination({
  page,
  pageSize,
  total,
  isFetching,
  onChangePage,
  onChangePageSize,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const displayPage = Math.min(Math.max(1, page), totalPages);

  let gotoInput = "";
  const setGotoInput = (_: string) => {
    gotoInput = _;
  };

  const handleGo = () => {
    const n = Number(gotoInput);
    if (!Number.isFinite(n)) return;
    onChangePage(Math.min(Math.max(1, n), totalPages));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 h-16 border-t md:flex-nowrap">
      <div className="flex items-center gap-2 shrink-0">
        <span className="whitespace-nowrap text-sm">Rows per page</span>
        <StableSelect
          value={String(pageSize)}
          onChange={(v) => {
            onChangePageSize(Number(v));
            onChangePage(1);
          }}
          options={[5, 10, 15, 20].map((n) => ({ value: String(n) }))}
          triggerClassName="w-[88px] shrink-0"
        />
      </div>

      <div className="flex items-center gap-3 text-sm shrink-0 flex-wrap md:flex-nowrap">
        <span className="text-muted-foreground shrink-0">
          Total: <span className="font-medium text-foreground">{total}</span>
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <span className="shrink-0">Page</span>
          <StableSelect
            value={String(displayPage)}
            onChange={(v) => onChangePage(Number(v))}
            options={Array.from({ length: totalPages }, (_, i) => ({
              value: String(i + 1),
            }))}
            triggerClassName="w-[88px] shrink-0"
            contentClassName="max-h-64"
            resetKey={totalPages}
          />
          <span className="text-muted-foreground shrink-0">/ {totalPages}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Label htmlFor="gotoPage" className="shrink-0">
            Go to
          </Label>
          <Input
            id="gotoPage"
            type="number"
            min={1}
            max={totalPages}
            onChange={(e) => setGotoInput(e.target.value)}
            className="w-20 shrink-0"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGo}
            disabled={isFetching}
            className="shrink-0"
          >
            Go
          </Button>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChangePage(Math.max(1, page - 1))}
            disabled={page <= 1 || isFetching}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChangePage(page + 1)}
            disabled={page >= totalPages || isFetching}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
