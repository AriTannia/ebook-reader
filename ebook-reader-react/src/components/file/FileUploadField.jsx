import { X, FileText } from "lucide-react";
import toast from "react-hot-toast";
 
import { FileDropZone } from "./FileDropZone";
import { validateFileSize, formatBytes } from "./FileValidation";
 
const DEFAULT_MAX_SIZE = 50 * 1024 * 1024; // 50MB

export function FileUploadField({
  file,
  existingUrl = "",
  accept,
  hint,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  onSelectFile,
  onRemove,
  disabled,
}) {
  const hasSomething = file || existingUrl;
 
  const pickReplacement = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    const error = validateFileSize(picked, { maxSizeBytes });
    if (error) {
      toast.error(error);
      return;
    }
    onSelectFile(picked);
  };
 
  return (
    <div>
      {!hasSomething ? (
        <FileDropZone
          size="sm"
          accept={accept}
          hint={hint}
          validate={(picked) => validateFileSize(picked, { maxSizeBytes })}
          onPick={onSelectFile}
          disabled={disabled}
        />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {file ? file.name : existingUrl.split("/").pop()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {file ? `${formatBytes(file.size)} \u2022 pending upload` : "Uploaded"}
            </p>
            <label className="mt-1 inline-block cursor-pointer text-xs text-primary hover:underline">
              Choose a different file
              <input
                type="file"
                accept={accept}
                onChange={pickReplacement}
                className="hidden"
                disabled={disabled}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove file"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
