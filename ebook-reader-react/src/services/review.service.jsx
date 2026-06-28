import api from "./api";

const API_URL = "/v1/books/";

export const getReviewsByBookId = (bookId, filters = {}) => {
  return api.get(`${API_URL}${bookId}/reviews`, {
    params: filters,
  });
}

export const addReview = (bookId, reviewData) => {
  return api.post(`${API_URL}${bookId}/reviews`, reviewData);
}

export const updateReview = (bookId, reviewId, updatedData) => {
  return api.put(`${API_URL}${bookId}/reviews/${reviewId}`, updatedData);
}

export const updateReviewHelpfulCount =  (bookId, reviewId) => {
  return api.put(`${API_URL}${bookId}/reviews/${reviewId}/helpful`);
}

export const deleteReview = (bookId, reviewId) => {
  return api.delete(`${API_URL}${bookId}/reviews/${reviewId}`);
}