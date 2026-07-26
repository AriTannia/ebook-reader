import { useEffect, useId, useRef } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// --- Confirm dialog ------------------------------------------------------

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-foreground/30 backdrop-blur-[1px]"
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg"
      >
        <h2 id={titleId} className="text-base font-semibold text-foreground">
          {title}
        </h2>

        <div id={descId} className="mt-3 space-y-2.5 text-sm leading-relaxed">
          {description}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={cx(
              "inline-flex cursor-pointer items-center rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              destructive
                ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
                : "bg-primary hover:bg-primary/90 focus-visible:ring-ring",
            )}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex cursor-pointer items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}