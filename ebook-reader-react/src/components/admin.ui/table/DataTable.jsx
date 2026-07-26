import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
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