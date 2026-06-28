import { useState, useRef } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAvatar } from "../reducers/user";
import { uploadFile } from "../reducers/file";
import toast from "react-hot-toast";

export default function AvatarUploadModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!validImageTypes.includes(file.type)) {
      return "Invalid file type. Please upload a JPEG, PNG, or WebP image.";
    }
    if (file.size > maxFileSize) {
      return "File size exceeds 5MB. Please upload a smaller image.";
    }
    return null;
  };

  const handleFileSelect = (file) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !preview) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadResult = await dispatch(
        uploadFile({
          file: selectedFile,
          onProgress: (percent) => setUploadProgress(percent),
        }),
      ).unwrap();

      console.log("Messi: " + uploadResult);
      console.log("Ri do: "+ uploadResult.filePath);

      await dispatch(
        updateUserAvatar({
          userId: currentUser.userId,
          avatarData: {
            avatarUrl: uploadResult.filePath,
          },
        }),
      ).unwrap();

      setUploadProgress(100);

      toast.success("Avatar updated successfully!");

      handleClose();
    } catch (error) {
      toast.error(error || "Failed to update avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview("");
    setUploadProgress(0);
    setIsDragging(false);
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="animate-modal-backdrop-in fixed inset-0 z-40 bg-black/40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="animate-modal-content-in fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Update Avatar</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {!preview ? (
          <>
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="mb-2 text-center text-sm text-foreground">
                Drag and drop an image here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-semibold text-primary underline hover:opacity-80 transition-opacity"
                >
                  choose a file
                </button>{" "}
                from your device.
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or WebP • Max 5MB
              </p>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
              aria-label="Upload image"
            />
          </>
        ) : (
          <>
            {/* Preview */}
            <div className="mb-6 flex flex-col items-center">
              <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-border">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* File Info */}
              {selectedFile && (
                <div className="mb-4 w-full rounded-lg bg-muted px-4 py-3 text-center">
                  <p className="text-xs font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {/* Remove Image Button */}
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="text-xs text-primary hover:underline disabled:opacity-50 transition-all"
              >
                Choose a different image
              </button>
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">
                    Uploading
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(uploadProgress)}%
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!selectedFile || isUploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save
              </>
            )}
          </button>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-medium hover:bg-muted transition-all active:scale-[0.98]"
          >
            <X className="h-4 w-4" style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b" }}>Cancel</span>
          </button>
        </div>
      </div>
    </>
  );
}
