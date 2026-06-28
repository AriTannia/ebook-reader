import api from "./api";

const API_URL = "/v1/files/";

export const generatePresignedAvatarUrl = (fileName) => {
    return api.post(API_URL + "/avatar/pre-signed-url", { fileName });
}