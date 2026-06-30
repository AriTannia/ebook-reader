import { Loader2, Search } from "lucide-react";

export function PageHeader({
  title,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  isFetching,
  action,
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border bg-card px-4 py-3 md:flex-row md:items-center md:gap-4 md:px-6">
      <h1 className="shrink-0 text-lg font-semibold text-foreground">{title}</h1>

      <div className="relative md:mx-auto md:w-full md:max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
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

      {action ? <div className="shrink-0 md:ml-auto">{action}</div> : null}
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