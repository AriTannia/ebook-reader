import { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";

// Helpers -------------------------------------------------------------------
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
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
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/10 text-danger",
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

// --- Status options (dùng chung format {id, label} cho mọi domain) --------

export const ORDER_STATUS_OPTIONS = [
  { id: "PAID", label: "Paid" },
  { id: "PENDING", label: "Pending" },
  { id: "CANCELLED", label: "Cancelled" },
  { id: "FAILED", label: "Failed" },
  { id: "REFUNDED", label: "Refunded" },
];

export const BOOK_STATUS_OPTIONS = [
  { id: "ACTIVE", label: "Available" },
  { id: "INACTIVE", label: "Unavailable" }
];

export function orderStatusVariant(status) {
  switch (status) {
    case "PAID":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
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