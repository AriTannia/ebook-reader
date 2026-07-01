import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Low-level "empty state" drop zone: drag & drop or click-to-browse.
 * It never uploads anything - it just validates the picked file and
 * hands it back to the parent via onPick. All three upload UIs in the
 * app (avatar, book cover, book format file) render this for the
 * "nothing selected yet" state and manage their own preview/selected
 * state afterwards.
 *
 * Props:
 *  - accept: string                 input[accept] value
 *  - hint: string                   helper text under the icon
 *  - validate(file): string|null    return an error message to reject
 *  - onPick(file): void             called with a validated File
 *  - disabled: boolean
 *  - size: "sm" | "md"              controls padding/icon size
 */
export function FileDropZone({ accept, hint, validate, onPick, disabled, size = "md" }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handlePick = (picked) => {
    if (!picked) return;
    const error = validate?.(picked);
    if (error) {
      toast.error(error);
      return;
    }
    onPick(picked);
  };

  const handleInputChange = (e) => {
    handlePick(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handlePick(e.dataTransfer.files?.[0]);
  };

  const padding = size === "sm" ? "px-4 py-8" : "px-6 py-12";
  const iconSize = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${padding} ${
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <Upload className={`mb-2 text-muted-foreground ${iconSize}`} aria-hidden="true" />
      <p className={`mb-1 text-center text-foreground ${textSize}`}>
        Drag and drop a file here, or{" "}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="font-semibold text-primary underline hover:opacity-80 transition-opacity"
        >
          choose a file
        </button>
      </p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload file"
        disabled={disabled}
      />
    </div>
  );
}