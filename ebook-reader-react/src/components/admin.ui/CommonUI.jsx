import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AVATAR_TINTS = [
  "bg-[oklch(0.93_0.05_286)] text-[oklch(0.45_0.18_286)]",
  "bg-[oklch(0.93_0.06_180)] text-[oklch(0.42_0.1_190)]",
  "bg-[oklch(0.94_0.06_70)] text-[oklch(0.48_0.12_60)]",
  "bg-[oklch(0.94_0.05_20)] text-[oklch(0.5_0.15_22)]",
  "bg-[oklch(0.93_0.05_150)] text-[oklch(0.44_0.11_150)]",
];

function initials(name) {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function tintFor(name) {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_TINTS[sum % AVATAR_TINTS.length];
}

// Avatar component -------------------------------------------------------

export function Avatar({ src, name, className }) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <span
      className={cx(
        "inline-flex size-8 shrink-0 items-center justify-center",
        "overflow-hidden rounded-full text-xs font-semibold",
        !showImage ? tintFor(name) : "",
        className || "",
      )}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          src={src || "/placeholder.svg"}
          alt=""
          className="size-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}

// Book Cover component -------------------------------------------------------

export function BookCover({ src, title }) {
  return (
    <span className="inline-flex h-12 w-9 shrink-0 overflow-hidden rounded-sm border border-border bg-muted shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || "/placeholder.svg"}
        alt={`Cover of ${title}`}
        className="size-full object-cover"
      />
    </span>
  );
}

// Role Pill component -------------------------------------------------------

export function RolePill({ role }) {
  const label = role.replace(/^ROLE_/, "");
  const isAdmin = role === "ROLE_ADMIN";

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        isAdmin
          ? "bg-accent text-accent-foreground"
          : "bg-neutral-soft text-neutral-soft-foreground",
      )}
    >
      {label.toLowerCase()}
    </span>
  );
}

// --- Status badge --------------------------------------------------------
// variant: "success" | "warning" | "danger" | "neutral"

const BADGE_STYLES = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  neutral: "bg-neutral-soft text-neutral-soft-foreground",
};

export function StatusBadge({ label, variant }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        BADGE_STYLES[variant] ?? BADGE_STYLES.neutral,
      )}
    >
      {label.toLowerCase()}
    </span>
  );
}

export function orderStatusVariant(status) {
  switch (status) {
    case "PAID":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "neutral";
    case "FAILED":
    case "REFUNDED":
      return "danger";
    default:
      return "neutral";
  }
}

export function bookStatusVariant(status) {
  return status === "ACTIVE" ? "success" : "neutral";
}

// --- Sortable column header ---------------------------------------------
export function SortableHeader({ label, field, sort, onSort, align = "left" }) {
  const active = sort?.field === field;
  return (
    <th
      scope="col"
      className={cx(
        "px-4 py-2.5 font-medium",
        align === "right" ? "text-right" : "text-left",
      )}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cx(
          "group inline-flex cursor-pointer items-center gap-1 rounded-sm outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
          align === "right" && "flex-row-reverse",
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-label={`Sort by ${label}`}
      >
        {label}
        {active ? (
          sort?.dir === "asc" ? (
            <ChevronUp className="size-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-3.5" aria-hidden="true" />
          )
        ) : (
          <ChevronsUpDown
            className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60"
            aria-hidden="true"
          />
        )}
      </button>
    </th>
  );
}

// Utility function to manage sort state + build query param "field, direction"
export function useSortState(initialField = null, initialDir = "asc") {
  const [sort, setSort] = useState(
    initialField ? { field: initialField, dir: initialDir } : null,
  );

  const handleSort = (field) => {
    setSort((prev) => {
      if (prev?.field === field) {
        return { field, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { field, dir: "asc" };
    });
  };

  const sortParam = sort ? `${sort.field},${sort.dir}` : undefined;

  return { sort, handleSort, sortParam };
}

// --- Pagination ----------------------------------------------------------
export function Pagination({ page, onPrev, onNext }) {
  const current = page ? page.number + 1 : 1;
  const total = page ? page.totalPages : 1;
  const baseBtn =
    "inline-flex cursor-pointer items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{current}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={baseBtn}
          onClick={onPrev}
          disabled={!page || page.first}
        >
          Previous
        </button>
        <button
          type="button"
          className={baseBtn}
          onClick={onNext}
          disabled={!page || page.last}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// --- Skeleton rows -------------------------------------------------------

export function SkeletonRows({ rows, cols }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-t border-border">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <div
                className="h-4 animate-pulse rounded bg-muted"
                style={{ width: `${40 + ((r + c) % 4) * 15}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// --- Empty state ---------------------------------------------------------

export function EmptyRow({ cols, message }) {
  return (
    <tr className="border-t border-border">
      <td
        colSpan={cols}
        className="px-4 py-12 text-center text-sm text-muted-foreground"
      >
        {message}
      </td>
    </tr>
  );
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
