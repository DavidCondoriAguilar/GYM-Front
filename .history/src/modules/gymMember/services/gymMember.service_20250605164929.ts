import axios from 'axios';
import { GymMember } from '../../../models/GymMember';

// Type-safe environment variables
interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
  VITE_API_GYM_MEMBERS_ENDPOINT: string;
}

// Get API configuration from environment variables
const env = (import.meta as any).env as ImportMetaEnv;

// Required environment variables
const requiredEnvVars = [
  'VITE_API_BASE_URL',
  'VITE_API_GYM_MEMBERS_ENDPOINT'
] as const;

// Validate required environment variables
const missingVars = requiredEnvVars.filter(varName => !env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Use environment variables
const {
  VITE_API_BASE_URL: API_BASE_URL,
  VITE_API_GYM_MEMBERS_ENDPOINT: GYM_MEMBERS_ENDPOINT
} = env;

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    // Return the full response and let the service methods handle the data extraction
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response error:', error.response.data);
      
      const errorData = {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
        isAxiosError: true
      };
      
      console.error('Response error details:', errorData);
      return Promise.reject(errorData);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      const errorData = {
        message: 'No response received from the server. Please try again.',
        status: 0,
        isAxiosError: true
      };
      console.error('Request error details:', errorData);
      return Promise.reject(errorData);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
      const errorData = {
        message: error.message || 'An error occurred',
        status: 0,
        isAxiosError: true
      };
      console.error('Error details:', errorData);
      return Promise.reject(errorData);
    }
  }
);

// API service methods
const GymMemberService = {
  // Get all gym members
  getAllMembers: async (): Promise<GymMember[]> => {
    try {
      console.log('Fetching members from:', `${API_BASE_URL}${GYM_MEMBERS_ENDPOINT}`);
      const response = await api.get<{ data: GymMember[] }>(GYM_MEMBERS_ENDPOINT);
      console.log('API Response data:', response.data);
      
      // Ensure we return the data in the expected format
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      console.warn('Unexpected response format:', response.data);
      return [];
    } catch (error: any) {
      console.error('Error in getAllMembers:', {
        message: error?.message || 'Unknown error',
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },

  // Get a single member by ID
  getMemberById: async (id: string): Promise<GymMember> => {
    try {
      console.log('Fetching member with id:', id);
      const { data } = await api.get<GymMember>(`${GYM_MEMBERS_ENDPOINT}/${id}`);
      console.log('API Response:', data);
      return data;
    } catch (error: any) {
      console.error(`Error fetching member with ID ${id}:`, error?.message || 'Unknown error');
      throw error;
    }
  },

  // Create a new member
  createMember: async (memberData: Omit<GymMember, 'id'>): Promise<GymMember> => {
    try {
      const { data } = await api.post<GymMember>(GYM_MEMBERS_ENDPOINT, memberData);
      return data;
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  },

  // Update an existing member
  updateMember: async (id: string, memberData: Partial<GymMember>): Promise<GymMember> => {
    try {
      const { data } = await api.put<GymMember>(`${GYM_MEMBERS_ENDPOINT}/${id}`, memberData);
      return data;
    } catch (error) {
      console.error(`Error updating member with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a member
  deleteMember: async (id: string): Promise<void> => {
    try {
      await api.delete(`${GYM_MEMBERS_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting member with ID ${id}:`, error);
      throw error;
    }
  }
};

export default GymMemberService;
