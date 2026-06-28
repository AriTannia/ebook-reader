import axios from "axios";

let refreshPromise = null;

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.log("INTERCEPTOR ERROR:", error.response?.status);
    console.log("REQUEST URL:", error.config?.url);
    if (!error.response || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response.status;

    const isRefreshRequest = originalRequest.url?.includes(
      "/auth/refresh-token",
    );

    if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post("/api/v1/auth/refresh-token", {}, { withCredentials: true })
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;

        return api(originalRequest);
      } catch (e) {
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
