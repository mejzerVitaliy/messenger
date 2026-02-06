import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from 'env';

import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setTokens,
} from './cookies';

interface RetryConfig extends InternalAxiosRequestConfig {
  retried?: boolean;
}

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

export const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    if (error.response?.status !== 401 || originalRequest.retried) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      removeTokens();

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      });
    }

    originalRequest.retried = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{
        accessToken: string;
        refreshToken: string;
      }>(`${env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, { refreshToken });

      setTokens(data.accessToken, data.refreshToken);
      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

      return await api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      removeTokens();
      window.location.href = '/sign-in';

      return await Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
