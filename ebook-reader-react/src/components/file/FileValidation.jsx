export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validates an image file against an allowed-type list and a max size.
 * Returns an error string, or null if the file is valid.
 */
export function validateImageFile(file, { maxSizeBytes = 5 * 1024 * 1024 } = {}) {
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Invalid file type. Please upload a JPEG, PNG, or WebP image.";
  }
  if (file.size > maxSizeBytes) {
    return `File size exceeds ${formatBytes(maxSizeBytes)}. Please upload a smaller image.`;
  }
  return null;
}

/**
 * Validates any file only against a max size (used for non-image uploads,
 * e.g. ebook formats, where the accept attribute already narrows the type).
 */
export function validateFileSize(file, { maxSizeBytes = 50 * 1024 * 1024 } = {}) {
  if (file.size > maxSizeBytes) {
    return `File is too large. Max size is ${formatBytes(maxSizeBytes)}.`;
  }
  return null;
}