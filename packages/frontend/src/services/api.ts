import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  User,
  Subscription,
  SubscriptionShare,
  Payment,
  Friend,
  Notification,
  MarketplaceListing,
  Budget,
  AuditLog,
  ServiceTemplate,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  LoginForm,
  RegisterForm,
  SubscriptionForm,
  ShareInviteForm,
  PaymentForm
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client[method](url, data)
    return response.data.data
  }
}

const apiClient = new ApiClient()

// Auth API
export const authApi = {
  login: (data: LoginForm) => 
    apiClient.request<{ user: User; token: string }>('post', '/auth/login', data),
  
  register: (data: RegisterForm) => 
    apiClient.request<{ user: User; token: string }>('post', '/auth/register', data),
  
  getCurrentUser: () => 
    apiClient.request<User>('get', '/auth/me'),
  
  updateProfile: (data: Partial<User>) => 
    apiClient.request<User>('patch', '/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    apiClient.request<void>('post', '/auth/change-password', data),
  
  requestPasswordReset: (email: string) => 
    apiClient.request<void>('post', '/auth/forgot-password', { email }),
  
  resetPassword: (data: { token: string; password: string }) => 
    apiClient.request<void>('post', '/auth/reset-password', data),
  
  verifyEmail: (token: string) => 
    apiClient.request<void>('post', '/auth/verify-email', { token }),
}

// Subscriptions API
export const subscriptionsApi = {
  getAll: (params?: { category?: string; search?: string; page?: number; limit?: number }) => 
    apiClient.request<PaginatedResponse<Subscription>>('get', `/subscriptions?${new URLSearchParams(params).toString()}`),
  
  getById: (id: string) => 
    apiClient.request<Subscription>('get', `/subscriptions/${id}`),
  
  create: (data: SubscriptionForm) => 
    apiClient.request<Subscription>('post', '/subscriptions', data),
  
  update: (id: string, data: Partial<SubscriptionForm>) => 
    apiClient.request<Subscription>('patch', `/subscriptions/${id}`, data),
  
  delete: (id: string) => 
    apiClient.request<void>('delete', `/subscriptions/${id}`),
  
  getShares: (id: string) => 
    apiClient.request<SubscriptionShare[]>('get', `/subscriptions/${id}/shares`),
  
  invite: (id: string, data: ShareInviteForm) => 
    apiClient.request<SubscriptionShare[]>('post', `/subscriptions/${id}/invite`, data),
  
  acceptInvite: (id: string, shareId: string) => 
    apiClient.request<SubscriptionShare>('post', `/subscriptions/${id}/shares/${shareId}/accept`),
  
  declineInvite: (id: string, shareId: string) => 
    apiClient.request<void>('post', `/subscriptions/${id}/shares/${shareId}/decline`),
  
  removeShare: (id: string, shareId: string) => 
    apiClient.request<void>('delete', `/subscriptions/${id}/shares/${shareId}`),
  
  getCredentials: (id: string, token: string) => 
    apiClient.request<{ credentials: any }>('post', `/subscriptions/${id}/credentials`, { token }),
  
  rotateCredentials: (id: string, newCredentials: any) => 
    apiClient.request<void>('post', `/subscriptions/${id}/rotate-credentials`, { credentials: newCredentials }),
}

// Payments API
export const paymentsApi = {
  getAll: (params?: { subscriptionId?: string; status?: string; page?: number; limit?: number }) => 
    apiClient.request<PaginatedResponse<Payment>>('get', `/payments?${new URLSearchParams(params).toString()}`),
  
  getById: (id: string) => 
    apiClient.request<Payment>('get', `/payments/${id}`),
  
  create: (data: PaymentForm) => 
    apiClient.request<Payment>('post', '/payments', data),
  
  createIntent: (data: { amount: number; subscriptionId: string }) => 
    apiClient.request<{ clientSecret: string }>('post', '/payments/intent', data),
  
  confirmPayment: (id: string) => 
    apiClient.request<Payment>('post', `/payments/${id}/confirm`),
  
  releaseEscrow: (id: string) => 
    apiClient.request<Payment>('post', `/payments/${id}/release`),
  
  refund: (id: string, reason?: string) => 
    apiClient.request<Payment>('post', `/payments/${id}/refund`, { reason }),
  
  getHistory: (subscriptionId: string) => 
    apiClient.request<Payment[]>('get', `/payments/subscription/${subscriptionId}/history`),
}

// Friends API
export const friendsApi = {
  getAll: () => 
    apiClient.request<Friend[]>('get', '/friends'),
  
  sendRequest: (friendId: string) => 
    apiClient.request<Friend>('post', '/friends/request', { friendId }),
  
  acceptRequest: (friendId: string) => 
    apiClient.request<Friend>('post', `/friends/${friendId}/accept`),
  
  declineRequest: (friendId: string) => 
    apiClient.request<void>('post', `/friends/${friendId}/decline`),
  
  remove: (friendId: string) => 
    apiClient.request<void>('delete', `/friends/${friendId}`),
  
  search: (query: string) => 
    apiClient.request<User[]>('get', `/friends/search?q=${encodeURIComponent(query)}`),
  
  getRequests: () => 
    apiClient.request<Friend[]>('get', '/friends/requests'),
}

// Notifications API
export const notificationsApi = {
  getAll: (params?: { type?: string; unread?: boolean; page?: number; limit?: number }) => 
    apiClient.request<PaginatedResponse<Notification>>('get', `/notifications?${new URLSearchParams(params).toString()}`),
  
  markAsRead: (id: string) => 
    apiClient.request<void>('patch', `/notifications/${id}/read`),
  
  markAllAsRead: () => 
    apiClient.request<void>('post', '/notifications/mark-all-read'),
  
  delete: (id: string) => 
    apiClient.request<void>('delete', `/notifications/${id}`),
  
  getUnreadCount: () => 
    apiClient.request<{ count: number }>('get', '/notifications/unread-count'),
}

// Marketplace API
export const marketplaceApi = {
  getListings: (params?: { category?: string; maxPrice?: number; page?: number; limit?: number }) => 
    apiClient.request<PaginatedResponse<MarketplaceListing>>('get', `/marketplace?${new URLSearchParams(params).toString()}`),
  
  getListing: (id: string) => 
    apiClient.request<MarketplaceListing>('get', `/marketplace/${id}`),
  
  createListing: (data: Partial<MarketplaceListing>) => 
    apiClient.request<MarketplaceListing>('post', '/marketplace', data),
  
  updateListing: (id: string, data: Partial<MarketplaceListing>) => 
    apiClient.request<MarketplaceListing>('patch', `/marketplace/${id}`, data),
  
  deleteListing: (id: string) => 
    apiClient.request<void>('delete', `/marketplace/${id}`),
  
  requestSlot: (id: string, message?: string) => 
    apiClient.request<void>('post', `/marketplace/${id}/request`, { message }),
}

// Budget API
export const budgetApi = {
  get: () => 
    apiClient.request<Budget>('get', '/budget'),
  
  update: (data: Partial<Budget>) => 
    apiClient.request<Budget>('patch', '/budget', data),
  
  getSpendingReport: (startDate: string, endDate: string) => 
    apiClient.request<{ categories: any[]; total: number; savings: number }>('get', `/budget/report?startDate=${startDate}&endDate=${endDate}`),
}

// Service Templates API
export const serviceTemplatesApi = {
  getAll: (category?: string) => 
    apiClient.request<ServiceTemplate[]>('get', `/service-templates?${category ? `category=${category}` : ''}`),
  
  getById: (id: string) => 
    apiClient.request<ServiceTemplate>('get', `/service-templates/${id}`),
  
  getCategories: () => 
    apiClient.request<string[]>('get', '/service-templates/categories'),
}

// Dashboard API
export const dashboardApi = {
  getStats: () => 
    apiClient.request<DashboardStats>('get', '/dashboard/stats'),
  
  getRecentActivity: (limit?: number) => 
    apiClient.request<any[]>('get', `/dashboard/activity?limit=${limit || 10}`),
  
  getUpcomingRenewals: () => 
    apiClient.request<Subscription[]>('get', '/dashboard/renewals'),
  
  getPendingPayments: () => 
    apiClient.request<Payment[]>('get', '/dashboard/pending-payments'),
}

// Audit API
export const auditApi = {
  getLogs: (params?: { subscriptionId?: string; action?: string; page?: number; limit?: number }) => 
    apiClient.request<PaginatedResponse<AuditLog>>('get', `/audit?${new URLSearchParams(params).toString()}`),
}

// Upload API
export const uploadApi = {
  uploadImage: (file: File, type: 'profile' | 'subscription') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return apiClient.request<{ url: string }>('post', '/upload/image', formData)
  },
}

export default apiClient 