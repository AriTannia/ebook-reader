import api from "./api";

const API_URL = "/v1/users/";

export const getUserProfile = (userId) => {
  return api.get(API_URL + userId);
};

export const updateUserProfile = (userId, updatedData) => {
  return api.put(API_URL + userId + "/profile", updatedData);
};

export const updateUserAvatar = (userId, avatarData) => {
  return api.put(API_URL + userId + "/avatar", avatarData);
};

export const deleteUser = (userId) => {
  return api.delete(API_URL + userId);
};
