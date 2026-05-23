import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authAPI = {
  login: (initData: string, phone?: string) => 
    api.post('/auth/login', { initData, phone }),
  getMe: () => api.get('/auth/me'),
}

// Menu
export const menuAPI = {
  getCategories: () => api.get('/menu/categories'),
  getProducts: (categoryId?: string) => 
    api.get('/menu/products', { params: { categoryId } }),
  getProduct: (id: string) => api.get(`/menu/products/${id}`),
}

// Orders
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getMy: () => api.get('/orders/my'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => 
    api.patch(`/orders/${id}/status`, { status }),
}

// User
export const userAPI = {
  updateProfile: (data: any) => api.patch('/users/me', data),
  getAddresses: () => api.get('/users/me/addresses'),
  createAddress: (data: any) => api.post('/users/me/addresses', data),
  updateAddress: (id: string, data: any) => 
    api.patch(`/users/me/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/me/addresses/${id}`),
}
