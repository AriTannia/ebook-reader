import axios from "axios";

let refreshPromise = null;
let isRedirecting = false;

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,

  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    });
    return searchParams.toString();
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response.status;

    const isPublicPath = PUBLIC_PATHS.includes(window.location.pathname);

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/signin") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/forgot-password") ||
      originalRequest.url?.includes("/auth/reset-password");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
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
        if (!isRedirecting && !isPublicPath) {
          isRedirecting = true;
          window.location.href = "/login";
        }
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);

export default api;