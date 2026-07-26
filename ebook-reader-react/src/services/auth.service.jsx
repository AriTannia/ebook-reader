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

export const changePassword = (oldPassword, newPassword) => {
  return api.patch(API_URL + "change-password", {oldPassword, newPassword});
};

export const forgotPassword = (email) => {
  return api.post(API_URL + "forgot-password", 
    null,
    {params: {email},
  });
};

export const resetPassword = (token, newPassword) => {
  return api.post(API_URL + "reset-password", {token, newPassword});   
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