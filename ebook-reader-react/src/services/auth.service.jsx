import api from "./api";

const API_URL = "/auth/";

export const register = (username, email, password) => {
  return api.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

export const login = (email, password) => {
  return api
    .post(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      return response.data; 
    });
};

export const refreshToken = () => {
  return api.post(API_URL + "refresh-token");
}

export const logout = () => {
    return api.post(API_URL + "signout");
}