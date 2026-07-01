import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

/**
 * Type-to-search single-select combobox.
 *
 * Behaves like a normal text input: typing filters the dropdown list below
 * it. Clicking an option selects it and closes the list. The displayed text
 * always mirrors the currently selected option's name whenever the field
 * isn't actively being edited (e.g. when the parent pre-fills `value` for
 * edit mode).
 */
export function SearchableSelectField({
  label,
  options,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  emptyOptionsMessage = "Nothing available yet.",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.id) === String(value)) ?? null;

  // Keep the input text in sync with the selected option, but only while
  // the person isn't actively typing/searching.
  useEffect(() => {
    if (open) return;
    setQuery(selectedOption ? selectedOption.name : "");
  }, [value, options]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery(selectedOption ? selectedOption.name : "");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption]);

  const filteredOptions =
    query.trim() === ""
      ? options
      : options.filter((opt) => opt.name.toLowerCase().includes(query.trim().toLowerCase()));

  const handleSelect = (opt) => {
    onChange(opt.id);
    setQuery(opt.name);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={disabled || options.length === 0}
          placeholder={options.length === 0 ? emptyOptionsMessage : placeholder}
          className="w-full rounded-md border border-border bg-background py-2 pl-3 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>

      {open && options.length > 0 && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-border bg-card shadow-lg">
          <ul className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-xs text-muted-foreground">No matches.</li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedOption && String(selectedOption.id) === String(opt.id);
                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt)}
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