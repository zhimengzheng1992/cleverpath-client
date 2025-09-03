// ConfirmDelete.tsx（也可以直接写在页面里）
"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

// 传入执行删除的异步函数和文案
export function useConfirmDelete() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [payload, setPayload] = useState<{
    ids: number[];
    title?: string;
  } | null>(null);

  const confirm = (ids: number[], title?: string) => {
    setPayload({ ids, title });
    setOpen(true);
  };

  // 供外部传入真正的删除逻辑
  const ConfirmDialog = ({
    onConfirm,
  }: {
    onConfirm: (ids: number[]) => Promise<void>;
  }) => (
    <Dialog open={open} onOpenChange={(o) => !pending && setOpen(o)}>
      <DialogContent
        // pending 时不允许外部点击关闭
        onInteractOutside={(e) => pending && e.preventDefault()}
        onEscapeKeyDown={(e) => pending && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{payload?.title ?? "Delete"}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {payload?.ids?.length === 1
            ? `Are you sure you want to delete employee #${payload?.ids[0]}?`
            : `Are you sure you want to delete ${payload?.ids.length} employees?`}
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={async () => {
              if (!payload) return;
              try {
                setPending(true);
                await onConfirm(payload.ids);
                toast.success("Deleted");
                setOpen(false);
              } catch (e: any) {
                toast.error(e?.message ?? "Delete failed");
              } finally {
                setPending(false);
              }
            }}
          >
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, ConfirmDialog };
}
