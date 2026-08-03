/**
 * Centralized API error message handler.
 *
 * Maps HTTP status codes (and known backend error codes) to consistent,
 * user-friendly frontend messages. This prevents raw backend error strings
 * from being exposed to the user and ensures message uniformity across
 * all reducers.
 *
 * @param {Error} error - The Axios error object caught in a catch block.
 * @param {Object} [customMessages={}] - Optional per-status overrides for
 *   this specific action (e.g. { 404: 'Book not found.' }).
 * @returns {string} A frontend-friendly error message string.
 */
export const getErrorMessage = (error, customMessages = {}) => {
  const status = error.response?.status;
  const codeNumber = error.response?.data?.codeNumber;
  const codeStatus = error.response?.data?.codeStatus;

  // --- Per-action custom overrides (highest priority) ---
  if (status && customMessages[status]) {
    return customMessages[status];
  }

  // --- Known backend code mappings ---
  if (codeNumber === 401 || codeStatus === "Unauthorized") {
    return "Incorrect email or password. Please try again.";
  }

  // --- HTTP status-based default messages ---
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
      return "You are not authorized. Please log in and try again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 408:
      return "The request timed out. Please try again.";
    case 409:
      return "A conflict occurred. The resource may already exist.";
    case 422:
      return "The provided data is invalid. Please check your input.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "An internal server error occurred. Please try again later.";
    case 502:
    case 503:
    case 504:
      return "The service is temporarily unavailable. Please try again later.";
    default:
      break;
  }

  // --- Network / no-response errors ---
  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  // --- Fallback ---
  return "An unexpected error occurred. Please try again.";
};
