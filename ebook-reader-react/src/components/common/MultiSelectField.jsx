import { useState } from "react";
import { Plus, X } from "lucide-react";

export function MultiSelectField({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = "Select...",
  disabled = false,
  emptyOptionsMessage = "Nothing available yet.",
}) {
  const [pendingValue, setPendingValue] = useState("");
 
  const selectedSet = new Set(selectedIds.map(String));
  const availableOptions = options.filter((opt) => !selectedSet.has(String(opt.id)));
 
  const handleAdd = () => {
    if (!pendingValue) return;
    if (selectedSet.has(String(pendingValue))) {
      setPendingValue("");
      return;
    }
    onChange([...selectedIds, pendingValue]);
    setPendingValue("");
  };
 
  const handleRemove = (id) => {
    onChange(selectedIds.filter((sid) => String(sid) !== String(id)));
  };
 
  const selectedOptions = selectedIds
    .map((id) => options.find((opt) => String(opt.id) === String(id)))
    .filter(Boolean);
 
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
 
      {selectedOptions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
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
        </div>
      )}
 
      {options.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyOptionsMessage}</p>
      ) : (
        <div className="flex gap-2">
          <select
            value={pendingValue}
            onChange={(e) => setPendingValue(e.target.value)}
            disabled={disabled || availableOptions.length === 0}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <option value="">
              {availableOptions.length === 0 ? "All added" : placeholder}
            </option>
            {availableOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled || !pendingValue}
            aria-label={`Add ${label}`}
            className="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-muted px-2.5 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
