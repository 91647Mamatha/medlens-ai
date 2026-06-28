import axios from 'axios'

export const API_BASE = 'http://127.0.0.1:8000'

export function createApiClient(token) {
  const api = axios.create({
    baseURL: API_BASE,
  })

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return api
}