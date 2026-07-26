import api from "./api";

const API_URL = "/v1/library";

export const getAllLibraryItems = (filters = {}) => {
    return api.get(API_URL, { params: filters });
}

export const checkLibraryItemExists = (bookId) => {
    return api.get(`${API_URL}/${bookId}/access`);
}

export const toggleFavoriteStatus = (bookId, isFavorite) => {
    return api.patch(`${API_URL}/${bookId}/favorite`, null, {
        params: { isFavorite },
    });
}

export const revokeLibraryItemAccess = (userId, bookId) => {
    return api.delete(`${API_URL}/admin/${userId}/books/${bookId}/revoke`);
}