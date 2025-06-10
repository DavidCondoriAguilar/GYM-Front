// src/api/endpoints.ts

const PAYMENTS_ENDPOINT = '/payments';
const GYM_MEMBERS_ENDPOINT = import.meta.env.VITE_API_GYM_MEMBERS_ENDPOINT;

if (!GYM_MEMBERS_ENDPOINT) {
  throw new Error('Missing environment variable: VITE_API_GYM_MEMBERS_ENDPOINT');
}

export { PAYMENTS_ENDPOINT, GYM_MEMBERS_ENDPOINT };
