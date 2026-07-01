import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { FileUploadField } from "../../file/FileUploadField";
import { uploadFile, FILE_UPLOAD_TYPE } from "../../../reducers/file";
import { addBookFormat } from "../../../reducers/book.format";

const FORMAT_TYPES = ["EPUB", "PDF", "MOBI", "AZW3", "TXT"];

const MIME_TO_FORMAT = {
  "application/epub+zip": "EPUB",
  "application/pdf": "PDF",
  "application/x-mobipocket-ebook": "MOBI",
  "text/plain": "TXT",
};

function detectFormatType(file) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  console.log("detectFormatType", file.name, ext, file.type);
  return MIME_TO_FORMAT[file.type] ?? "";
}

function inputClass() {
  return "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60";
}

export default function BookFormatFormModal({
  isOpen,
  bookId,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [formatType, setFormatType] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setFile(null);
    setFormatType("");
    setIsPrimary(false);
    setIsSubmitting(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectFile = (picked) => {
    setFile(picked);
    const detectedFormat = detectFormatType(picked);
    setFormatType(detectedFormat);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFormatType("");
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Choose a file to upload.");
      return;
    }
    if (!formatType) {
      toast.error("Select a format type.");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadResult = await dispatch(uploadFile({ file, type: FILE_UPLOAD_TYPE.BOOK_FORMAT })).unwrap();

      await dispatch(
        addBookFormat({
          bookId,
          formatData: {
            formatType,
            storageUrl: uploadResult.filePath,
            mimeType: file.type || "application/octet-stream",
            fileSize: file.size,
            isPrimary,
          },
        }),
      ).unwrap();

      toast.success("Book format added.");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error || "Failed to add book format.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="animate-modal-backdrop-in fixed inset-0 z-40 bg-black/40"
        onClick={handleClose}
      />

      <div className="animate-modal-content-in fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Add book format</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              File
            </label>
            <FileUploadField
              file={file}
              accept=".epub,.pdf,.mobi,.azw3,.txt"
              hint="EPUB, PDF, MOBI, AZW3, or TXT"
              disabled={isSubmitting}
              onSelectFile={handleSelectFile}
              onRemove={handleRemoveFile}
            />
          </div>

          {formatType ? (
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2">
              <span className="text-sm">
                Format: <strong>{formatType}</strong>
              </span>
            </div>
          ) : (
            <p className="text-sm text-destructive">
              Unable to determine the file format.
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            Add format
          </button>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center rounded-lg border bg-white px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
            style={{ color: "#64748b" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
