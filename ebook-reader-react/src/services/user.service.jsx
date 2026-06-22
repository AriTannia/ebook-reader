import api from "./api";

const API_URL = "/public/users/";

export const getUserProfile = (userId) => {
  return api.get(API_URL + userId);
};

export const updateUserProfile = (userId, updatedData) => {
  return api.put(API_URL + userId, updatedData);
};