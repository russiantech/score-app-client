export const getEnv = (key: string): string => {
  const value = import.meta.env[key];
  return value || '';
};

export const isProduction = () => {
  return import.meta.env.PROD;
};

export const isDevelopment = () => {
  return import.meta.env.DEV;
};

export const getApiBaseUrl = () => {
  return getEnv('VITE_API_BASE_URL') || 'http://localhost:5000/api';
};

export const getAppName = () => {
  return getEnv('VITE_APP_NAME') || 'Score App - Dunistech Academy';
};