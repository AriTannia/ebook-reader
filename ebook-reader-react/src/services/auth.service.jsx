import api from "./api";

const API_URL = "/v1/auth/";

export const register = (fullName, email, password) => {
  return api.post(API_URL + "signup", {
    fullName,
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

export const getCurrentUser = () => {
  return api.get(API_URL + "me");
};