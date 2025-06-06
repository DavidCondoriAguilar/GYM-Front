import axiosInstance from '../api/axiosInstance';
import { MEMBERSHIP_PLANS_ENDPOINT } from '../api/endpoints';

/**
 * Get all membership plans
 * @param {Object} params - Query parameters for filtering/sorting
 * @returns {Promise<Array>} - Array of membership plans
 */
const getPlans = async (params = {}) => {
  try {
    const response = await axiosInstance.get(MEMBERSHIP_PLANS_ENDPOINT, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching membership plans:', error);
    throw error;
  }
};

/**
 * Get a single membership plan by ID
 * @param {string} id - The UUID of the membership plan
 * @returns {Promise<Object>} - The membership plan data
 */
const getPlanById = async (id) => {
  try {
    const response = await axiosInstance.get(`${MEMBERSHIP_PLANS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching membership plan with id ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new membership plan
 * @param {Object} planData - The data for the new membership plan
 * @returns {Promise<Object>} - The created membership plan data
 */
const createPlan = async (planData) => {
  try {
    const response = await axiosInstance.post(MEMBERSHIP_PLANS_ENDPOINT, planData);
    return response.data;
  } catch (error) {
    console.error('Error creating membership plan:', error);
    throw error;
  }
};

/**
 * Update an existing membership plan
 * @param {string} id - The UUID of the membership plan to update
 * @param {Object} planData - The updated data for the membership plan
 * @returns {Promise<Object>} - The updated membership plan data
 */
const updatePlan = async (id, planData) => {
  try {
    const response = await axiosInstance.put(
      `${MEMBERSHIP_PLANS_ENDPOINT}/${id}`,
      planData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating membership plan with id ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a membership plan
 * @param {string} id - The UUID of the membership plan to delete
 * @returns {Promise<void>}
 */
const deletePlan = async (id) => {
  try {
    await axiosInstance.delete(`${MEMBERSHIP_PLANS_ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error deleting membership plan with id ${id}:`, error);
    throw error;
  }
};

/**
 * Get active membership plans (custom implementation based on your business logic)
 * @returns {Promise<Array>} - Array of active membership plans
 */
const getActivePlans = async () => {
  try {
    // You might want to add query parameters for active status if your API supports it
    const response = await axiosInstance.get(MEMBERSHIP_PLANS_ENDPOINT, {
      params: { status: 'ACTIVE' } // Adjust according to your API
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching active membership plans:', error);
    throw error;
  }
};

/**
 * Get popular membership plans (custom implementation based on your business logic)
 * @param {number} limit - Maximum number of popular plans to return
 * @returns {Promise<Array>} - Array of popular membership plans
 */
const getPopularPlans = async (limit = 3) => {
  try {
    const response = await axiosInstance.get(MEMBERSHIP_PLANS_ENDPOINT, {
      params: { sort: 'popularity', limit }
    });
    return response.data;
  } catch (error) {
    console.warn('getPopularPlans: This endpoint might not be implemented in your backend');
    console.error('Error fetching popular membership plans:', error);
    return []; // Return empty array as fallback
  }
};

const membershipPlanService = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getActivePlans,
  getPopularPlans,
};

export default membershipPlanService;