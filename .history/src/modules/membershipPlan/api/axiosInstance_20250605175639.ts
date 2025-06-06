// src/modules/membershipPlan/api/axiosInstance.ts
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

interface ApiError {
  message: string;
  status: number;
  data?: any;
  isAxiosError: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError): Promise<never> => {
    if (error.response) {
      const responseData = error.response.data as { message?: string };
      const errorData: ApiError = {
        message: responseData?.message || 'Request failed',
        status: error.response.status,
        data: error.response.data,
        isAxiosError: true,
      };
      return Promise.reject(errorData);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({
        message: 'No response received from server',
        status: 0,
        isAxiosError: true,
      } as ApiError);
    } else {
      // Something happened in setting up the request
      return Promise.reject({
        message: error.message || 'Error setting up request',
        status: 0,
        isAxiosError: true,
      } as ApiError);
    }
  }
);

export default axiosInstance;
