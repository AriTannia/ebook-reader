import { useState, useRef } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { FileDropZone } from "../file/FileDropZone";
import { validateImageFile, formatBytes } from "../file/FileValidation";
import { updateUserAvatar } from "../../reducers/user";
import { uploadFile, FILE_UPLOAD_TYPE } from "../../reducers/file";
import toast from "react-hot-toast";

export default function AvatarUploadModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
 
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };
 
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview("");
    setUploadProgress(0);
  };
 
  const handleSave = async () => {
    if (!selectedFile || !preview) return;
 
    setIsUploading(true);
    setUploadProgress(0);
 
    try {
      const uploadResult = await dispatch(
        uploadFile({
          file: selectedFile,
          type: FILE_UPLOAD_TYPE.AVATAR
        }),
      ).unwrap();
 
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
    setIsUploading(false);
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
          <div className="mb-6">
            <FileDropZone
              accept="image/jpeg,image/png,image/webp"
              hint="JPG, PNG, or WebP  •  Max 5MB"
              validate={(picked) => validateImageFile(picked)}
              onPick={handleFileSelect}
            />
          </div>
        ) : (
          <>
            {/* Preview */}
            <div className="mb-6 flex flex-col items-center">
              <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-border">
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              </div>
 
              {/* File Info */}
              {selectedFile && (
                <div className="mb-4 w-full rounded-lg bg-muted px-4 py-3 text-center">
                  <p className="text-xs font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(selectedFile.size)}</p>
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
                  <p className="text-xs font-medium text-foreground">Uploading</p>
                  <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</p>
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