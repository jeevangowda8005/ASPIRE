import axios from 'axios'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const api = axios.create({ baseURL: API_BASE })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aspire_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('aspire_token')
      localStorage.removeItem('aspire_user')
      if (window.location.pathname !== '/login') window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
export const authApi = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),
  me: () => api.get('/api/auth/me'),
}
export const assessmentApi = {
  submit: (payload) => api.post('/api/checkins', payload),
  dashboard: () => api.get('/api/dashboard'),
  history: () => api.get('/api/history'),
}
export default api
