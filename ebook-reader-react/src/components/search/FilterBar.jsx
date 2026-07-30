import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { SlidersHorizontal, Check, ChevronDown, X } from "lucide-react";

const getOptionLabel = (opt) => opt.name ?? opt.label ?? String(opt.id);

/**
 * Search-to-filter multi-select control, styled/behaving like
 * SearchableSelectField, used for any "options" type group.
 */
function SearchableMultiControl({ group }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedSet = new Set(group.selected.map(String));
  const selectedOptions = group.options.filter((opt) => selectedSet.has(String(opt.id)));

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
      ? group.options
      : group.options.filter((opt) => getOptionLabel(opt).toLowerCase().includes(query.trim().toLowerCase()));

  const toggleOption = (opt) => {
    const id = String(opt.id);
    if (selectedSet.has(id)) {
      group.onRemove(opt.id);
    } else {
      group.onAdd(opt.id);
    }
  };

  const removeChip = (e, id) => {
    e.stopPropagation();
    group.onRemove(id);
  };

  const showChips = selectedOptions.length > 0 && !open;

  return (
    <div ref={wrapperRef} className="relative">
      <div
        onClick={() => setOpen(true)}
        className="relative flex min-h-10 w-full cursor-text items-center rounded-md border border-border bg-background py-1.5 pl-3 pr-9 text-sm focus-within:ring-2 focus-within:ring-ring"
      >
        {showChips ? (
          <div className="flex flex-wrap items-center gap-1 py-0.5">
            {selectedOptions.map((opt) => (
              <span
                key={opt.id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-0.5 pl-2 pr-1 text-xs font-medium text-primary"
              >
                {getOptionLabel(opt)}
                <button
                  type="button"
                  onClick={(e) => removeChip(e, opt.id)}
                  aria-label={`Remove ${getOptionLabel(opt)}`}
                  className="rounded-full p-0.5 hover:bg-primary/20"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            disabled={group.options.length === 0}
            placeholder={
              group.options.length === 0
                ? "Nothing available yet."
                : selectedOptions.length > 0
                  ? selectedOptions.map(getOptionLabel).join(", ")
                  : "Search..."
            }
            className="w-full bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed"
          />
        )}
        <ChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      </div>

      {open && group.options.length > 0 && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-border bg-card shadow-lg">
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
                      onClick={() => toggleOption(opt)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted ${
                        isSelected ? "font-medium text-primary" : "text-foreground"
                      }`}
                    >
                      <span className="truncate">{getOptionLabel(opt)}</span>
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

function DateRangeControl({ group }) {
  const { from, to } = group.value;

  const handleFromChange = (e) => {
    const newFrom = e.target.value;
    const newTo = to && newFrom && newFrom > to ? newFrom : to;
    group.onChange({ from: newFrom, to: newTo });
  };

  const handleToChange = (e) => {
    const newTo = e.target.value;
    const newFrom = from && newTo && newTo < from ? newTo : from;
    group.onChange({ from: newFrom, to: newTo });
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="date"
        value={from}
        max={to || undefined}
        onChange={handleFromChange}
        className="h-10 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm"
      />
      <span className="shrink-0 text-xs text-muted-foreground">to</span>
      <input
        type="date"
        value={to}
        min={from || undefined}
        onChange={handleToChange}
        className="h-10 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm"
      />
    </div>
  );
}

function GroupField({ group }) {
  // Date-range needs two full date inputs side by side — cramming that into
  // one half-width grid column is what was clipping the "mm/dd/yyyy" text
  // against the native calendar icon, so it gets the full panel width.
  const isDateRange = group.type === "date-range";
  return (
    <div className={isDateRange ? "sm:col-span-2" : undefined}>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{group.label}</label>
        {group.isActive && (
          <button type="button" onClick={group.onClear} className="text-[11px] text-muted-foreground hover:text-foreground">
            Clear
          </button>
        )}
      </div>
      {isDateRange ? <DateRangeControl group={group} /> : <SearchableMultiControl group={group} />}
    </div>
  );
}

export function FilterBar({ groups }) {
  const activeGroups = groups.filter((g) => g.isActive);
  const clearAll = () => activeGroups.forEach((g) => g.onClear());

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted/50"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeGroups.length > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {activeGroups.length}
            </span>
          )}
        </button>
      </Popover.Trigger>

      {/* Portal renders the panel straight into document.body, so it's
          never clipped by a scrollable/overflow-hidden table wrapper and
          always stacks above the rest of the page. */}
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          collisionPadding={12}
          className="z-50 w-[min(92vw,640px)] rounded-xl border border-border bg-card p-5 shadow-lg"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Filters</h2>
            <Popover.Close className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </Popover.Close>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <GroupField key={group.key} group={group} />
            ))}
          </div>

          {activeGroups.length > 0 && (
            <div className="mt-4 flex justify-end border-t border-border pt-4">
              <button onClick={clearAll} className="text-sm text-muted-foreground hover:text-foreground underline">
                Clear all
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}