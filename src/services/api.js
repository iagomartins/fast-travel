import axios from 'axios'
import { SessionStorage } from 'quasar'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = SessionStorage.getItem('session_key')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
      SessionStorage.remove('session_key')
      SessionStorage.remove('user_id')
      SessionStorage.remove('user_type')
    }
    return Promise.reject(error)
  }
)

export default api

