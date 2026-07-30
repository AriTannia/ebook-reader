import { Loader2, Search } from "lucide-react";

export function PageHeader({ title, action }) {
  return (
    <header
      className="sticky top-16 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:px-6"
      style={{ minHeight: "64px" }}
    >
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function TableShell({ children }) {
  return (
    <div className="p-4 md:p-6">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {children}
      </div>
    </div>
  );
}

export function TableToolbar({ filters, actions }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5 md:px-6">
      <div className="flex flex-wrap items-center gap-2">
        {filters}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search...", isFetching }) {
  return (
    <div className="relative max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
      {isFetching && (
        <Loader2
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {isFetching ? "Loading results" : ""}
      </span>
    </div>
  );
}