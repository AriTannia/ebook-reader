// Role Pill component -------------------------------------------------------
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

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