// src/modules/membershipPlan/api/endpoints.ts

const MEMBERSHIP_PLANS_ENDPOINT = import.meta.env.VITE_API_MEMBERSHIP_PLANS_ENDPOINT || '/api/membership-plans';

if (!MEMBERSHIP_PLANS_ENDPOINT) {
  console.warn('Missing environment variable: VITE_API_MEMBERSHIP_PLANS_ENDPOINT. Using default endpoint.');
}

export { MEMBERSHIP_PLANS_ENDPOINT };
