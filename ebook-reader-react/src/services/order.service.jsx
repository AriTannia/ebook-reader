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