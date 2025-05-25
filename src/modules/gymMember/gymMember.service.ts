import axios from 'axios';

// Get API configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const GYM_MEMBERS_ENDPOINT = import.meta.env.VITE_API_GYM_MEMBERS_ENDPOINT || '/gym-members';
const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'gym_app_token';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response error:', error.response.data);
      
      // Handle specific error statuses
      if (error.response.status === 401) {
        // Handle unauthorized (e.g., token expired)
        localStorage.removeItem(TOKEN_KEY);
        // You might want to redirect to login page here
        window.location.href = '/login';
      }
      
      return Promise.reject({
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      return Promise.reject({
        message: 'No response received from the server. Please try again.',
        status: 0
      });
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
      return Promise.reject({
        message: error.message || 'An error occurred',
        status: 0
      });
    }
  }
);

// API service methods
const GymMemberService = {
  // Get all gym members
  getAllMembers: async () => {
    try {
      const response = await api.get(GYM_MEMBERS_ENDPOINT);
      return response;
    } catch (error) {
      console.error('Error fetching gym members:', error);
      throw error;
    }
  },

  // Get a single member by ID
  getMemberById: async (id) => {
    try {
      const response = await api.get(`${GYM_MEMBERS_ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching member with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new member
  createMember: async (memberData) => {
    try {
      const response = await api.post(GYM_MEMBERS_ENDPOINT, memberData);
      return response;
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  },

  // Update an existing member
  updateMember: async (id, memberData) => {
    try {
      const response = await api.put(`${GYM_MEMBERS_ENDPOINT}/${id}`, memberData);
      return response;
    } catch (error) {
      console.error(`Error updating member with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a member
  deleteMember: async (id) => {
    try {
      await api.delete(`${GYM_MEMBERS_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting member with ID ${id}:`, error);
      throw error;
    }
  },

  // Set authentication token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Clear authentication
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

export default GymMemberService;
