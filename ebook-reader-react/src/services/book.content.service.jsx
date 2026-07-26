import api from "./api";

const API_URL = "/v1/books";

export const buildStreamUrl = (bookId) => {
  return `${api.defaults.baseURL}${API_URL}/${bookId}/stream`;
};

export const getContentUrl = (bookId) => {
  return api.get(`${API_URL}/${bookId}/content-url`);
};

export const getBookFormatForReading = (bookId) => {
  return api.get(`${API_URL}/${bookId}/format`);
};