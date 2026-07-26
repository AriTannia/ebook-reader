import api from "./api";

const API_URL = "/v1/books";

export const getAllBooks = (filters = {}, badge) => {
  return api.get(API_URL, {
    params: {
      ...filters,
      ...(badge ? { badge } : {}),
    },
  });
};

export const searchBooks = (filters = {}) => {
  return api.get(`${API_URL}/search`, {
    params: {
      ...filters,
    },
  });
};

export const getBookDetails = (bookId) => {
  return api.get(API_URL + "/" + bookId);
};

export const getAllBooksForAdmin = (filters = {}, badge) => {
  return api.get(`${API_URL}/admin`, {
    params: {
      ...filters,
      ...(badge ? { badge } : {}),
    },
  });
};

export const addNewBook = (bookDataList) => {
  return api.post(`${API_URL}/admin`, bookDataList);
};

export const updateBookDetails = (bookId, updatedData) => {
  return api.put(`${API_URL}/${bookId}/admin`, updatedData);
};

export const deleteBook = (bookId) => {
  return api.delete(`${API_URL}/${bookId}/admin`);
};
