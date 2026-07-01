import { useEffect, useRef, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";

/**
 * Chips of already-selected items + a "+" button. Clicking the "+" opens a
 * floating panel with a search bar on top and the full option list below;
 * clicking an item toggles it in/out of the selection. Used for Authors and
 * Categories, which can each have several values.
 */
export function MultiSelectPopover({
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
  const selectedOptions = selectedIds
    .map((id) => options.find((opt) => String(opt.id) === String(id)))
    .filter(Boolean);

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

  const handleRemove = (id) => {
    onChange(selectedIds.filter((sid) => String(sid) !== String(id)));
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>

      <div className="flex flex-wrap items-center gap-1.5">
        {selectedOptions.map((opt) => (
          <span
            key={opt.id}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pl-2.5 pr-1.5 text-xs font-medium text-primary"
          >
            {opt.name}
            <button
              type="button"
              onClick={() => handleRemove(opt.id)}
              disabled={disabled}
              aria-label={`Remove ${opt.name}`}
              className="rounded-full p-0.5 hover:bg-primary/20 disabled:opacity-50"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          disabled={disabled || options.length === 0}
          aria-label={`Add ${label}`}
          className="inline-flex items-center justify-center rounded-full border border-dashed border-border p-1 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

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