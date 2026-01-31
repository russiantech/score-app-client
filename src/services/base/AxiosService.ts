// v - original
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { getEnv } from '@/utils/env';
import { NotificationService } from '@/services/local/NotificationService';
import { UserStorageService } from '@/services/local/UserStorageService';

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

let navigationHandler: ((path: string) => void) | null = null;

export const registerNavigation = (handler: (path: string) => void) => {
  navigationHandler = handler;
};

const createAxiosInstance = (contentType = 'application/json'): AxiosInstance => {
  const instance = axios.create({
    baseURL: getEnv('VITE_API_BASE_URL') || "http://localhost:8000/api/v1",
    timeout: 50000,
    headers: {
      'Content-Type': contentType,
    },
    responseType: 'json',
  });

  instance.interceptors.request.use((config) => {
    const user = UserStorageService.getCurrentUser();
    if (user?.tokens?.access_token) {
      if (!config.headers) {
        config.headers = {} as import('axios').AxiosRequestHeaders;
      }
      config.headers.Authorization = `Bearer ${user.tokens.access_token}`;
    }
    return config;
  });

  return instance;
};

// JSON instance for standard requests
const jsonInstance = createAxiosInstance();

// Multipart instance for file uploads
const multipartInstance = createAxiosInstance('multipart/form-data');

const handleAuthError = async (_error: AxiosError): Promise<void> => {
  const user = UserStorageService.getCurrentUser();
  if (!user) return;

  UserStorageService.signout();
  NotificationService.showDialog('Session expired. Please sign in again.', 'error');
  
  if (navigationHandler) {
    navigationHandler('/auth/signin');
  }

};

const setupResponseInterceptor = (instance: AxiosInstance): void => {
  
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      if (!originalRequest || !error.response) return Promise.reject(error);

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        try {
          const newToken = await handleTokenRefresh();
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          await handleAuthError(error);
        }
      }

      // Handle other errors
      if (error.response.status >= 500) {
        NotificationService.showDialog('Server error. Please try again later.', 'error');
      }

      return Promise.reject(error);
    }
  ); 

};

let isRefreshing = false;

const handleTokenRefresh = async (): Promise<string|null> => {
  const auth = UserStorageService.getCurrentUser();

  if (!auth?.tokens?.refresh_token) {
    throw new Error('No refresh token available');
  }

  if (isRefreshing) return null;
  isRefreshing = true;

  try{
  const response = await jsonInstance.post<RefreshTokenResponse>(
    '/auth/refresh-token',
    { refresh_token: auth.tokens.refresh_token }
  );

  const updatedAuth = {
    ...auth,
    tokens: {
      access_token: response.data.access_token,
      refresh_token:
        response.data.refresh_token ?? auth.tokens.refresh_token,
    },
  };

  UserStorageService.authenticate(updatedAuth);
  return response.data.access_token;
  } catch (error) {
    await handleAuthError(error as AxiosError);
    return null;

  } finally {
    isRefreshing = false;
  }
};

// Set up interceptors for both instances
setupResponseInterceptor(jsonInstance);
setupResponseInterceptor(multipartInstance);

export const AxiosService = {
  json: {
    get: (url: string, config?: AxiosRequestConfig) => jsonInstance.get(url, config),
    post: (url: string, data?: unknown, config?: AxiosRequestConfig) => 
      jsonInstance.post(url, data, config),
    put: (url: string, data?: unknown, config?: AxiosRequestConfig) => 
      jsonInstance.put(url, data, config),
    delete: (url: string, config?: AxiosRequestConfig) => 
      jsonInstance.delete(url, config),
    patch: (url: string, data?: unknown, config?: AxiosRequestConfig) => 
      jsonInstance.patch(url, data, config),
  },

  multipart: {
    post: (url: string, data?: unknown, config?: AxiosRequestConfig) => 
      multipartInstance.post(url, data, config),
    put: (url: string, data?: unknown, config?: AxiosRequestConfig) => 
      multipartInstance.put(url, data, config),
  },

  fetchPage: (url: string, params: Record<string, any> = { page: 1, page_size: 10 }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return jsonInstance.get(`${url}?${searchParams.toString()}`);
  }
};

