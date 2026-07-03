import api from "./api";

const API_URL = "/v1/reading-progress";

export const saveProgress = (progressData) => {
  return api.put(API_URL, progressData);
}

export const openBookForReading = (bookId) => {
  return api.post(`${API_URL}/${bookId}`);
}

export const refreshReadingUrl = (bookId) => {
  return api.post(`${API_URL}/${bookId}/refresh`);
}

export const getRecentReading = (limit = 10) => {
  return api.get(`${API_URL}/recent`, { params: { limit } });
}

export const markAsFinished = (bookId) => {
  return api.post(`${API_URL}/${bookId}/finish`);
}