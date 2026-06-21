import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const requestUrl = originalRequest?.url || '';

        if(status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest){
            originalRequest._retry = true;
            try {
                refreshPromise ??= axios.post("/api/auth/refresht-token", {}, { withCredentials: true });

                await refreshPromise;
                refreshPromise = null;

                return api(originalRequest);
            } catch (refreshError) {
                refreshPromise = null;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;