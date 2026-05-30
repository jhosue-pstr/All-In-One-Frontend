export const getApiUrl = () =>
  typeof import.meta !== 'undefined' && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:8000/api';