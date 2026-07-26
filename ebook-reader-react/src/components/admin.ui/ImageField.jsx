import { X, ImageOff } from "lucide-react";
import toast from "react-hot-toast";
import { FileDropZone } from "../file/FileDropZone";
import { validateImageFile, formatBytes } from "../file/FileValidation";

export function ImageField({
  file,
  previewUrl,
  onSelectFile,
  onRemove,
  disabled,
  label = "Image",
  hint = "JPG, PNG, or WebP • Max 5MB",
  accept = "image/jpeg,image/png,image/webp",
  currentLabel = "Current image",
  shape = "rect", // "rect" | "circle"
  previewSize = "h-20 w-16", // (avatar: "h-16 w-16")
}) {
  const previewShapeClass =
    shape === "circle" ? "rounded-full" : "rounded-md";

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {!previewUrl ? (
        <FileDropZone
          size="sm"
          accept={accept}
          hint={hint}
          validate={(picked) => validateImageFile(picked)}
          onPick={onSelectFile}
          disabled={disabled}
        />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
          <div
            className={`${previewSize} shrink-0 overflow-hidden border border-border bg-muted ${previewShapeClass}`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`${label} preview`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageOff className="h-5 w-5" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {file ? file.name : currentLabel}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {file
                ? `${formatBytes(file.size)} \u2022 pending upload`
                : "Uploaded"}
            </p>
            <label className="mt-1 inline-block cursor-pointer text-xs text-primary hover:underline">
              Choose a different image
              <input
                type="file"
                accept={accept}
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  e.target.value = "";
                  if (!picked) return;
                  const error = validateImageFile(picked);
                  if (error) {
                    toast.error(error);
                    return;
                  }
                  onSelectFile(picked);
                }}
                className="hidden"
                disabled={disabled}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${label.toLowerCase()}`}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}