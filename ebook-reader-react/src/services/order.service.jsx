import api from "./api";

const API_URL = "/v1/orders";

export const createOrder = () => {
    return api.post(API_URL + "/checkout");
};

export const getMyOrders = (filters = {}) => {
    return api.get(API_URL + "/me", {
        params: {
            ...filters
        }
    });
};

export const getMyOrderById = (orderId) => {
    return api.get(API_URL + "/me/" + orderId);
};

export const cancelMyOrder = (orderId) => {
    return api.delete(API_URL + "/me/" + orderId + "/cancel");
};

export const getAllOrdersForAdmin = (filters = {}) => {
  return api.get(`${API_URL}/admin`, {
    params: {
      ...filters,
    },
  });
};

export const getOrderByIdForAdmin = (orderId) => {
  return api.get(`${API_URL}/admin/${orderId}`);
};

export const cancelOrderByAdmin = (orderId) => {
  return api.patch(`${API_URL}/admin/${orderId}/cancel`);
};

export const refundOrder = (orderId) => {
  return api.patch(`${API_URL}/admin/${orderId}/refund`);
};