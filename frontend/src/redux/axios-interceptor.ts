import {
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';
import { axiosInstance } from './axios-instance';
import { logout, refresh } from './auth/operations';
import { store } from './store';

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

let isRefreshing = false;

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(axiosInstance(config));
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    if (
      ((error.response?.status === 403 &&
        (error.response?.data as { detail?: string })?.detail ===
          'Not authenticated') ||
        (error.response?.status === 401 &&
          (error.response?.data as { detail?: string })?.detail ===
            'Invalid token')) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          failedQueue.push({ resolve, reject, config: originalRequest }),
        );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await store.dispatch(refresh()).unwrap();
        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        store.dispatch(logout());

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
