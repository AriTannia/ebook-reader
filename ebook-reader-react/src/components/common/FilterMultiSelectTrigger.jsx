import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

/**
 * A closed, fixed-height trigger (same footprint as a native <select>) that
 * opens a searchable popover for multi-select. Selected items show as a
 * count badge on the trigger instead of growing the row — the actual chips
 * are rendered separately by the parent (see ActiveFilterChips in SearchStore).
 */
export function FilterMultiSelectTrigger({
  label,
  options,
  selectedIds,
  onChange,
  disabled = false,
  emptyOptionsMessage = "Nothing available yet.",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);

  const selectedSet = new Set(selectedIds.map(String));

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions =
    query.trim() === ""
      ? options
      : options.filter((opt) => opt.name.toLowerCase().includes(query.trim().toLowerCase()));

  const toggleOption = (id) => {
    if (selectedSet.has(String(id))) {
      onChange(selectedIds.filter((sid) => String(sid) !== String(id)));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-xs text-muted-foreground">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled || options.length === 0}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="truncate">
          {selectedIds.length === 0 ? "All" : `${label} selected`}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {selectedIds.length > 0 && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
              {selectedIds.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </span>
      </button>

      {options.length === 0 && (
        <p className="mt-1 text-xs text-muted-foreground">{emptyOptionsMessage}</p>
      )}

      {open && (
        <div className="absolute z-30 mt-2 w-64 overflow-hidden rounded-md border border-border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-2.5 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-xs text-muted-foreground">No matches.</li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedSet.has(String(opt.id));
                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      onClick={() => toggleOption(opt.id)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted ${
                        isSelected ? "font-medium text-primary" : "text-foreground"
                      }`}
                    >
                      <span className="truncate">{opt.name}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}