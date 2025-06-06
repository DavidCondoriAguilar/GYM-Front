// src/modules/membershipPlan/api/endpoints.ts

// Remove the '/api' prefix to match the Spring Boot controller's @RequestMapping
const MEMBERSHIP_PLANS_ENDPOINT = import.meta.env.VITE_API_MEMBERSHIP_PLANS_ENDPOINT || '/membership-plans';

if (!import.meta.env.VITE_API_MEMBERSHIP_PLANS_ENDPOINT) {
  console.warn('VITE_API_MEMBERSHIP_PLANS_ENDPOINT is not set, using default: /membership-plans');
}

export { MEMBERSHIP_PLANS_ENDPOINT };
