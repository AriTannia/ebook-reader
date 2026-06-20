import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "/api/auth/";

export const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

export const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      return response.data; 
    });
};

export const logout = () => {
    return axios.post(API_URL + "signout");
}