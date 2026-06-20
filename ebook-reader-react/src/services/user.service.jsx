import axios from 'axios';

const API_URL = '/api/users/';

export const getPublicContent = () => {
  return axios.get(API_URL + 'all');
};

export const getUserBoard = () => {
  return axios.get(API_URL + 'user');
};

export const getAdminBoard = () => {
  return axios.get(API_URL + 'admin');
};