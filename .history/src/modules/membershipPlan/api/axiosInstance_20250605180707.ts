// src/api/axiosInstance.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = {
      message: error.response?.data?.message || 'Request failed',
      status: error.response?.status || 0,
      data: error.response?.data,
      isAxiosError: true,
    };
    return Promise.reject(errorData);
  }
);

export default api;
