import api from "./api";

const API_URL = "/v1/users";

export const updateUserProfile = (userId, updatedData) => {
  return api.patch(API_URL + userId + "/profile", updatedData);
};

export const updateUserAvatar = (userId, avatarData) => {
  return api.patch(API_URL + userId + "/avatar", avatarData);
};


export const getAllUsers = (filters = {}) => {
  return api.get(`${API_URL}/admin`, {
    params: {
      ...filters,
    },
  });
};

export const getUserById = (userId) => {
  return api.get(`${API_URL}/${userId}/admin`);
};

export const createUser = (userData) => {
  return api.post(`${API_URL}/admin`, userData);
};

export const deleteUser = (userId) => {
  return api.delete(`${API_URL}/${userId}/admin`);
};

export const updateUserRole = (userId, roleData) => {
  return api.patch(`${API_URL}/${userId}/admin`, roleData);
};