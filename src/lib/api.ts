import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    username: string;
    password: string;
    displayName?: string;
  }) => api.post('/auth/register', data),

  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data: {
    displayName?: string;
  }) => api.put('/users/profile', data),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => api.put('/users/change-password', data),
};

// Bank Account API
export const bankAccountAPI = {
  getAll: () => api.get('/bank-accounts'),
  
  create: (data: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
    accountType: 'checking' | 'savings';
  }) => api.post('/bank-accounts', data),
  
  setPrimary: (id: number) => api.put(`/bank-accounts/${id}/set-primary`),
  
  delete: (id: number) => api.delete(`/bank-accounts/${id}`),
};

// Transaction API
export const transactionAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    type?: 'deposit' | 'withdrawal';
    status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  }) => api.get('/transactions', { params }),
  
  getById: (id: number) => api.get(`/transactions/${id}`),
  
  createDeposit: (data: {
    amount: number;
    bankAccountId: number;
    description?: string;
  }) => api.post('/transactions/deposit', data),
  
  createWithdrawal: (data: {
    amount: number;
    bankAccountId: number;
    description?: string;
  }) => api.post('/transactions/withdrawal', data),
  
  cancel: (id: number) => api.put(`/transactions/${id}/cancel`),
};



export default api;
