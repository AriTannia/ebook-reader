import api from "./api";

const API_URL = "/v1/publishers";

export const getAllPublishers = () => {
  return api.get(API_URL);
};

export const getPublisherById = (publisherId) => {
  return api.get(`${API_URL}/${publisherId}`);
};

export const getAllPublishersForAdmin = (filters = {}) => {
  return api.get(`${API_URL}/admin`, {
    params: {
      ...filters,
    },
  });
};

export const addNewPublisher = (publisherData) => {
  return api.post(`${API_URL}/admin`, publisherData);
};

export const updatePublisherDetails = (publisherId, updatedData) => {
  return api.put(`${API_URL}/${publisherId}/admin`, updatedData);
};

export const deletePublisher = (publisherId) => {
  return api.delete(`${API_URL}/${publisherId}/admin`);
};