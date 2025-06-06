// src/api/endpoints.ts

const GYM_MEMBERS_ENDPOINT = import.meta.env.VITE_API_GYM_MEMBERS_ENDPOINT;

if (!GYM_MEMBERS_ENDPOINT) {
  throw new Error('Missing environment variable: VITE_API_GYM_MEMBERS_ENDPOINT');
}

export { GYM_MEMBERS_ENDPOINT };
