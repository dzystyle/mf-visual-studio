import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PromptDialog({
  open,
  onOpenChange,
  title,
  label,
  placeholder,
  defaultValue = "",
  confirmText = "确定",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  onConfirm: (value: string) => void;
}) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (open) setValue(defaultValue);
  }, [open, defaultValue]);

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    onConfirm(v);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-card border-border/60 p-8 rounded-3xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        </DialogHeader>
        {label && <label className="text-xs font-bold text-muted-foreground">{label}</label>}
        <Input
          autoFocus
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="h-11 bg-muted/30 border-border/40"
        />
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 h-10 border-border/50" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button className="flex-1 h-10 bg-primary hover:bg-primary/90 font-bold" onClick={submit}>
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "确认",
  destructive = true,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-card border-border/60 p-8 rounded-3xl">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        </DialogHeader>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 h-10 border-border/50" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className={
              destructive
                ? "flex-1 h-10 bg-destructive hover:bg-destructive/90 text-white font-bold"
                : "flex-1 h-10 bg-primary hover:bg-primary/90 font-bold"
            }
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
