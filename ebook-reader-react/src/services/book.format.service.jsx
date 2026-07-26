import api from "./api";

const API_URL = "/v1/books/{bookId}/formats";

export const getAllBookFormats = (bookId) => {
  return api.get(API_URL.replace("{bookId}", bookId));
};

export const addNewBookFormat = (bookId, formatData) => {
  return api.post(`${API_URL.replace("{bookId}", bookId)}/admin`, formatData);
};

export const updatePrimaryFormat = (bookId, formatId, isPrimary) => {
  return api.patch(
    `${API_URL.replace("{bookId}", bookId)}/${formatId}/admin`,
    null,
    { params: { isPrimary } }
  );
};

export const deleteBookFormat = (bookId, formatId) => {
  return api.delete(`${API_URL.replace("{bookId}", bookId)}/${formatId}/admin`);
};