const PAYMENTS_ENDPOINT = import.meta.env.VITE_API_BASE_URL + '/payments';
const GYM_MEMBERS_ENDPOINT = import.meta.env.VITE_API_BASE_URL + '/gym-members';

export { PAYMENTS_ENDPOINT, GYM_MEMBERS_ENDPOINT };

// Verificar que la API esté configurada correctamente
console.log('API endpoints:', {
  PAYMENTS_ENDPOINT,
  GYM_MEMBERS_ENDPOINT,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL
});
