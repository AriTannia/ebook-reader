import api from "./api";

const API_URL = "/v1/authors";

export const getAllAuthors = () => {
  return api.get(API_URL);
};

export const getAuthorById = (authorId) => {
  return api.get(`${API_URL}/${authorId}`);
};

export const getAllAuthorsForAdmin = (filters = {}) => {
  return api.get(`${API_URL}/admin`, {
    params: {
      ...filters,
    },
  });
};

export const addNewAuthor = (authorData) => {
  return api.post(`${API_URL}/admin`, authorData);
};

export const updateAuthorDetails = (authorId, updatedData) => {
  return api.put(`${API_URL}/${authorId}/admin`, updatedData);
};

export const deleteAuthor = (authorId) => {
  return api.delete(`${API_URL}/${authorId}/admin`);
};