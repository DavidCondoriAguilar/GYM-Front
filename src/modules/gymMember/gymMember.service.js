import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080', // Your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      console.error('Status code:', error.response.status);
      const errorMessage = error.response.data?.message || error.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      return Promise.reject(new Error('No response received from server'));
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

const gymMemberService = {
  /**
   * Get all gym members
   * @returns {Promise<Array>} Array of gym members
   */
  async getAllMembers() {
    try {
      return await api.get('/gym-members');
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  /**
   * Get a single gym member by ID
   * @param {string} id - The ID of the member to fetch
   * @returns {Promise<Object>} The gym member data
   */
  async getMemberById(id) {
    try {
      return await api.get(`/gym-members/${id}`);
    } catch (error) {
      console.error(`Error fetching member with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new gym member
   * @param {Object} memberData - The data for the new member
   * @returns {Promise<Object>} The created member data
   */
  async createMember(memberData) {
    try {
      return await api.post('/gym-members', memberData);
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  },

  /**
   * Update an existing gym member
   * @param {string} id - The ID of the member to update
   * @param {Object} memberData - The updated member data
   * @returns {Promise<Object>} The updated member data
   */
  async updateMember(id, memberData) {
    try {
      return await api.put(`/gym-members/${id}`, memberData);
    } catch (error) {
      console.error(`Error updating member with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a gym member
   * @param {string} id - The ID of the member to delete
   * @returns {Promise<void>}
   */
  async deleteMember(id) {
    try {
      await api.delete(`/gym-members/${id}`);
    } catch (error) {
      console.error(`Error deleting member with ID ${id}:`, error);
      throw error;
    }
  }
};

export default gymMemberService;
