import api from "./api";

const API_URL = "/v1/categories";

export const getAllCategories = () => {
  return api.get(API_URL);
};

export const getCategoryById = (categoryId) => {
  return api.get(`${API_URL}/${categoryId}`);
};

export const getAllCategoriesForAdmin = (filters = {}) => {
  return api.get(`${API_URL}/admin`, {
    params: {
      ...filters,
    },
  });
};

export const addNewCategory = (categoryData) => {
  return api.post(`${API_URL}/admin`, categoryData);
};

export const updateCategoryDetails = (categoryId, updatedData) => {
  return api.put(`${API_URL}/${categoryId}/admin`, updatedData);
};

export const deleteCategory = (categoryId) => {
  return api.delete(`${API_URL}/${categoryId}/admin`);
};