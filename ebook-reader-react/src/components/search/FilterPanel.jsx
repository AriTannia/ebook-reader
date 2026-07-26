import { X } from "lucide-react";
import { FilterMultiSelectTrigger } from "../common/FilterMultiSelectTrigger";

const SORT_OPTIONS = [
  { value: "title,asc", label: "Title (A-Z)" },
  { value: "title,desc", label: "Title (Z-A)" },
  { value: "price,asc", label: "Price (Low to High)" },
  { value: "price,desc", label: "Price (High to Low)" },
  { value: "publishedDate,asc", label: "Release Date (Oldest First)" },
  { value: "publishedDate,desc", label: "Release Date (Newest First)" },
];

// Builds the removable chip list for currently selected authors/categories/tags.
function buildActiveChips({ filters, authorOptions, categoryOptions, tagOptions, removeFromMultiParam }) {
  const groups = [
    { key: "authorIds", ids: filters.authorIds, options: authorOptions },
    { key: "categoryIds", ids: filters.categoryIds, options: categoryOptions },
    { key: "tagIds", ids: filters.tagIds, options: tagOptions },
  ];

  return groups.flatMap(({ key, ids, options }) =>
    ids
      .map((id) => {
        const opt = options.find((o) => String(o.id) === String(id));
        if (!opt) return null;
        return { chipKey: `${key}-${id}`, name: opt.name, onRemove: () => removeFromMultiParam(key, id) };
      })
      .filter(Boolean),
  );
}

export function FilterPanel({
  filters,
  authorOptions,
  categoryOptions,
  tagOptions,
  publisherOptions,
  setMultiParam,
  removeFromMultiParam,
  setSingleParam,
  clearAllFilters,
  clearMultiFilters,
  onClose,
}) {
  const activeChips = buildActiveChips({ filters, authorOptions, categoryOptions, tagOptions, removeFromMultiParam });

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Filter & Sort</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <FilterMultiSelectTrigger
          label="Author"
          options={authorOptions}
          selectedIds={filters.authorIds}
          onChange={(ids) => setMultiParam("authorIds", ids)}
          emptyOptionsMessage="No authors available."
        />

        <FilterMultiSelectTrigger
          label="Category"
          options={categoryOptions}
          selectedIds={filters.categoryIds}
          onChange={(ids) => setMultiParam("categoryIds", ids)}
          emptyOptionsMessage="No categories available."
        />

        <FilterMultiSelectTrigger
          label="Tag"
          options={tagOptions}
          selectedIds={filters.tagIds}
          onChange={(ids) => setMultiParam("tagIds", ids)}
          emptyOptionsMessage="No tags available."
        />

        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">Publisher</label>
          <select
            value={filters.publisherId}
            onChange={(e) => setSingleParam("publisherId", e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="">All</option>
            {publisherOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">Sort by</label>
          <select
            value={filters.sort}
            onChange={(e) => setSingleParam("sort", e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {activeChips.map((chip) => (
            <span
              key={chip.chipKey}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-1.5 text-xs font-medium text-primary"
            >
              {chip.name}
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove ${chip.name}`}
                className="rounded-full p-0.5 hover:bg-primary/20"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <button onClick={clearMultiFilters} className="text-xs text-muted-foreground hover:text-foreground underline">
            Clear selected
          </button>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button onClick={clearAllFilters} className="text-sm text-muted-foreground hover:text-foreground underline">
          Clear filters
        </button>
      </div>
    </div>
  );
}