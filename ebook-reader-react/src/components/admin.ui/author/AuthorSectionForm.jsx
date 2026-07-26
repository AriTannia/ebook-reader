import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import {Field} from "../../common/Field";
import { ImageField } from "../ImageField";

function inputClass() {
  return "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";
}

export default function AuthorSectionForm({
  section,
  mode,
  index,
  showCollapse,
  showRemove,
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
            {isEdit ? "Edit Author Section" : ` Author ${index + 1}`}
          </span>
        </button>
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(section.key)}
            className="flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`Remove author ${index + 1}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {!section.collapsed && (
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {isEdit && (
            <Field label="Author ID">
              <input
                type="text"
                value={section.authorId ?? ""}
                disabled
                className={inputClass()}
              />
            </Field>
          )}
          <Field label="Author Name" required>
            <input
              type="text"
              value={section.authorName ?? ""}
              onChange={(e) => patch({ authorName: e.target.value })}
              placeholder="Author name"
              className={inputClass()}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Biography">
              <textarea
                value={section.authorBio}
                onChange={(e) => patch({ authorBio: e.target.value })}
                placeholder="Short biography of the author"
                rows={3}
                className={inputClass()}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <ImageField
              file={section.authorImage.file}
              label="Author image"
              accept="image/jpeg,image/png,image/webp"
              hint="JPG, PNG, or WebP  •  Max 5MB"
              previewSize="h-16 w-16"
              shape="circle"
              currentLabel={
                section.authorImage.existingUrl ? "Uploaded" : "No image uploaded"
              }
              previewUrl={section.authorImage.preview || section.authorImage.existingUrl}
              disabled={section.uploadingAuthorImage}
              onSelectFile={(file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  patch({
                    authorImage: {
                      file,
                      preview: reader.result,
                      existingUrl: section.authorImage.existingUrl,
                    },
                  });
                };
                reader.readAsDataURL(file);
              }}
              onRemove={() =>
                patch({ authorImage: { file: null, preview: "", existingUrl: "" } })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
