import api from "./api";

const API_URL = "/v1/library";

export const getAllLibraryItems = (filters = {}) => {
    return api.get(API_URL, { params: filters });
}

export const checkLibraryItemExists = (bookId) => {
    return api.get(`${API_URL}/${bookId}/access`);
}

export const toggleFavoriteStatus = (bookId) => {
    return api.post(`${API_URL}/${bookId}/favorite`);
}

export const revokeLibraryItemAccess = (userId, bookId) => {
    return api.delete(`${API_URL}/admin/${userId}/books/${bookId}/revoke`);
}