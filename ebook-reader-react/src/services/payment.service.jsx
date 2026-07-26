import api from "./api";

const API_URL = "/v1";

export const createPaymentIntent = (orderId, provider) => {
  return api.post(API_URL + "/orders/" + orderId + "/payments", null, {
    params: {
      provider: provider,
    },
  });
};

export const getPaymentsByOrderId = (orderId) => {
  return api.get(API_URL + "/orders/me/" + orderId + "/payments");
};
