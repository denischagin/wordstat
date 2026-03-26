import { ENV_SEO_BACKEND_URL } from "@/constants/env";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

export const baseQuery = axios.create({
  baseURL: ENV_SEO_BACKEND_URL,
});

baseQuery.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

baseQuery.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await baseQuery.post("/refresh");
        const { accessToken } = response.data;
        useAuthStore.getState().setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return baseQuery(originalRequest);
      } catch {
        useAuthStore.getState().clearAccessToken();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
