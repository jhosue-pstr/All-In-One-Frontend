const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const API_BASE_URL = RAW_API_BASE_URL.endsWith('/api')
  ? RAW_API_BASE_URL
  : `${RAW_API_BASE_URL.replace(/\/$/, '')}/api`

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  timeout: 30000,
}

export const getApiUrl = () => API_BASE_URL