import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { Field } from "../../common/Field";
import { ImageField } from "../ImageField";
import { MultiSelectPopover } from "../../common/MultiSelectPopover";
import { SearchableSelectField } from "../../common/SearchableSelectField";
import { BOOK_STATUS_OPTIONS } from "./Badges";

function inputClass() {
  return "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";
}

export default function BookSectionForm({
  section,
  mode,
  index,
  showCollapse,
  showRemove,
  authors,
  categories,
  tags,
  publishers,
  onUpdate,
  onToggleCollapse,
  onRemove,
}) {
  const isEdit = mode === "edit";

  const patch = (fields) => onUpdate(section.key, fields);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <button
          type="button"
          onClick={() => showCollapse && onToggleCollapse(section.key)}
          className={`flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-semibold text-foreground ${
            showCollapse ? "cursor-pointer" : "cursor-default"
          }`}
        >
          {showCollapse ? (
            section.collapsed ? (
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            ) : (
              <ChevronUp
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            )
          ) : null}
          <span className="truncate">
            {isEdit ? "Book details" : `Book ${index + 1}`}
            {section.title ? ` - ${section.title}` : ""}
          </span>
        </button>
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(section.key)}
            aria-label={`Remove book ${index + 1}`}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {!section.collapsed && (
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {isEdit && (
            <Field label="Book ID">
              <input
                type="text"
                value={section.bookId ?? ""}
                disabled
                className={inputClass()}
              />
            </Field>
          )}

          <Field label="Title" required>
            <input
              type="text"
              value={section.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Book title"
              className={inputClass()}
            />
          </Field>

          <Field label="Price (USD)" required>
            <input
              type="number"
              min="0"
              step="0.01"
              value={section.price}
              onChange={(e) => patch({ price: e.target.value })}
              placeholder="0.00"
              className={inputClass()}
            />
          </Field>

          <Field label="Published date">
            <input
              type="date"
              value={section.publishedDate}
              onChange={(e) => patch({ publishedDate: e.target.value })}
              className={inputClass()}
            />
          </Field>

          <Field label="Language">
            <input
              type="text"
              value={section.language}
              onChange={(e) => patch({ language: e.target.value })}
              placeholder="e.g. English"
              className={inputClass()}
            />
          </Field>

          {isEdit && (
            <Field label="Status">
              <select
                value={section.status}
                onChange={(e) => patch({ status: e.target.value })}
                className={inputClass()}
              >
                <option value="">Select status</option>
                {BOOK_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <SearchableSelectField
            label="Publisher"
            options={publishers.map((p) => ({
              id: p.publisherId,
              name: p.publisherName,
            }))}
            value={section.publisherId}
            onChange={(id) => patch({ publisherId: id })}
            placeholder="Search publisher..."
            emptyOptionsMessage="No publishers yet."
          />

          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                value={section.description}
                onChange={(e) => patch({ description: e.target.value })}
                placeholder="Short description of the book"
                rows={3}
                className={inputClass()}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <ImageField
              file={section.cover.file}
              label="Cover image"
              accept="image/jpeg,image/png,image/webp"
              hint="JPG, PNG, or WebP  •  Max 5MB"
              previewSize="h-20 w-16"
              shape="rect"
              currentLabel={
                section.cover.existingUrl ? "Uploaded" : "No image uploaded"
              }
              previewUrl={section.cover.preview || section.cover.existingUrl}
              disabled={section.uploadingCover}
              onSelectFile={(file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  patch({
                    cover: {
                      file,
                      preview: reader.result,
                      existingUrl: section.cover.existingUrl,
                    },
                  });
                };
                reader.readAsDataURL(file);
              }}
              onRemove={() =>
                patch({ cover: { file: null, preview: "", existingUrl: "" } })
              }
            />
          </div>

          <MultiSelectPopover
            label="Authors"
            options={authors.map((a) => ({
              id: a.authorId,
              name: a.authorName,
            }))}
            selectedIds={section.authorIds}
            onChange={(ids) => patch({ authorIds: ids })}
            emptyOptionsMessage="No authors yet."
          />

          <MultiSelectPopover
            label="Categories"
            options={categories.map((c) => ({
              id: c.categoryId,
              name: c.categoryName,
            }))}
            selectedIds={section.categoryIds}
            onChange={(ids) => patch({ categoryIds: ids })}
            emptyOptionsMessage="No categories yet."
          />

          <MultiSelectPopover
            label="Tags"
            options={tags.map((t) => ({ id: t.tagId, name: t.tagName }))}
            selectedIds={section.tagIds}
            onChange={(ids) => patch({ tagIds: ids })}
            emptyOptionsMessage="No tags yet."
          />
        </div>
      )}
    </div>
  );
}