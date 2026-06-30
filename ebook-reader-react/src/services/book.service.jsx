import api from "./api";

const API_URL = "/v1/books";

export const getAllBooks = (filters = {}, badge) => {
  return api.get(API_URL, {
    params: {
      ...filters,
      badge
    },
  });
};

export const getBookDetails = (bookId) => {
  return api.get(API_URL + "/" + bookId);
};

export const addNewBook = (bookData) => {
  return api.post(API_URL, bookData);
};

export const updateBookDetails = (bookId, updatedData) => {
  return api.put(API_URL + "/" + bookId, updatedData);
};

export const deleteBook = (bookId) => {
  return api.delete(API_URL + "/" + bookId);
};