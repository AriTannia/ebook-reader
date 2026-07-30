// Normalizes any filter (status, author, date range, ...) into one shape
// FilterBar can render without knowing what the field actually means.

export function makeListGroup({ key, label, options, selected, onAdd, onRemove, onClear }) {
  return {
    key,
    label,
    type: "list",
    options,
    selected,
    onAdd,
    onRemove,
    onClear: onClear ?? (() => [...selected].forEach(onRemove)),
    isActive: selected.length > 0,
    chipText:
      selected.length === 0
        ? ""
        : selected.length === 1
          ? (options.find((o) => o.id === selected[0])?.name ?? 
          options.find((o) => o.id === selected[0])?.label ?? 
          String(selected[0]))
          : `${selected.length} selected`,
  };
}

export function makeDateRangeGroup({ key, label, value, onChange, onClear }) {
  return {
    key,
    label,
    type: "date-range",
    value,
    onChange,
    onClear: onClear ?? (() => onChange({ from: "", to: "" })),
    isActive: Boolean(value.from || value.to),
    chipText:
      value.from && value.to
        ? `${value.from} \u2192 ${value.to}`
        : value.from || value.to || "",
  };
}