import api from "./api";

const API_URL = "/v1/tags";

export const getAllTags = () => {
  return api.get(API_URL);
};

export const getTagById = (tagId) => {
  return api.get(`${API_URL}/${tagId}`);
};

export const getAllTagsForAdmin = (filters = {}) => {
  return api.get(`${API_URL}/admin`, {
    params: {
      ...filters,
    },
  });
};

export const addNewTag = (tagData) => {
  return api.post(`${API_URL}/admin`, tagData);
};

export const updateTagDetails = (tagId, updatedData) => {
  return api.put(`${API_URL}/${tagId}/admin`, updatedData);
};

export const deleteTag = (tagId) => {
  return api.delete(`${API_URL}/${tagId}/admin`);
};