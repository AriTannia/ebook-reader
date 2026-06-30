import api from "./api";

const API_URL = "/v1/cart";

export const getCart = () => {
    return api.get(API_URL);
};

export const addCartItem = (cartData) => {
    return api.post(API_URL + "/items", cartData);
};

export const removeCartItem = (cartItemId) => {
    return api.delete(API_URL + "/items/" + cartItemId);
};

export const clearCart = () => {
    return api.delete(API_URL);
};