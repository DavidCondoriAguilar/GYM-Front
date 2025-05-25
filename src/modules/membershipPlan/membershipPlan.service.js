import axios from 'axios';

const API_URL = '/api/membership-plans'; // Replace with your actual API endpoint

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        console.error('Unauthorized access - please login again');
      } else if (error.response.status === 403) {
        console.error('Forbidden - you do not have permission to access this resource');
      } else if (error.response.status === 404) {
        console.error('Resource not found');
      } else if (error.response.status >= 500) {
        console.error('Server error - please try again later');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server - please check your connection');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

const membershipPlanService = {
  /**
   * Get all membership plans with optional filtering and pagination
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise<Array>} - Array of membership plans
   */
  async getPlans(params = {}) {
    try {
      const response = await api.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      throw error;
    }
  },

  /**
   * Get a single membership plan by ID
   * @param {string} id - The ID of the membership plan to fetch
   * @returns {Promise<Object>} - The membership plan data
   */
  async getPlanById(id) {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching membership plan with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new membership plan
   * @param {Object} planData - The data for the new membership plan
   * @returns {Promise<Object>} - The created membership plan data
   */
  async createPlan(planData) {
    try {
      const response = await api.post(API_URL, planData);
      return response.data;
    } catch (error) {
      console.error('Error creating membership plan:', error);
      throw error;
    }
  },

  /**
   * Update an existing membership plan
   * @param {string} id - The ID of the membership plan to update
   * @param {Object} updates - The updates to apply to the membership plan
   * @returns {Promise<Object>} - The updated membership plan data
   */
  async updatePlan(id, updates) {
    try {
      const response = await api.put(`${API_URL}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating membership plan with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a membership plan
   * @param {string} id - The ID of the membership plan to delete
   * @returns {Promise<Object>} - The result of the delete operation
   */
  async deletePlan(id) {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting membership plan with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get active membership plans
   * @returns {Promise<Array>} - Array of active membership plans
   */
  async getActivePlans() {
    try {
      const response = await api.get(`${API_URL}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active membership plans:', error);
      throw error;
    }
  },

  /**
   * Get popular membership plans
   * @returns {Promise<Array>} - Array of popular membership plans
   */
  async getPopularPlans() {
    try {
      const response = await api.get(`${API_URL}/popular`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular membership plans:', error);
      throw error;
    }
  },
};

export default membershipPlanService;
