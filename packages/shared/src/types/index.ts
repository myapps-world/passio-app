// Shared types for Passio application
// These types are used across web, mobile, and backend

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  isVerified: boolean
  isStudent: boolean
  universityEmail?: string
  profileImageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  ownerId: string
  name: string
  description?: string
  serviceUrl?: string
  iconUrl?: string
  category?: string
  monthlyCost: number
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily'
  maxMembers: number
  nextBillingDate: string
  purchaseDate?: string
  renewalDate?: string
  notes?: string
  isActive: boolean
  autoRenewal: boolean
  createdAt: string
  updatedAt: string
  owner?: User
  shares?: SubscriptionShare[]
  currentMembers?: number
  totalCost?: number
  costPerMember?: number
}

export interface SubscriptionShare {
  id: string
  subscriptionId: string
  userId: string
  role: 'owner' | 'member'
  sharePercentage: number
  status: 'pending' | 'active' | 'declined' | 'removed'
  joinedAt?: string
  lastAccessedAt?: string
  permissions: SharePermissions
  createdAt: string
  updatedAt: string
  user?: User
  subscription?: Subscription
}

export interface SharePermissions {
  canViewCredentials: boolean
  canModifySettings: boolean
  canInviteMembers: boolean
  hasTimeLimit: boolean
  expiresAt?: string
}

export interface Payment {
  id: string
  subscriptionId: string
  payerId: string
  receiverId: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'stripe' | 'paypal' | 'bank_transfer'
  stripePaymentIntentId?: string
  paypalOrderId?: string
  escrowReleaseDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
  payer?: User
  receiver?: User
  subscription?: Subscription
}

export interface Friend {
  id: string
  userId: string
  friendId: string
  status: 'pending' | 'accepted' | 'blocked'
  createdAt: string
  updatedAt: string
  friend?: User
}

export interface Notification {
  id: string
  userId: string
  type: 'payment' | 'renewal' | 'share' | 'security' | 'friend' | 'general'
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface MarketplaceListing {
  id: string
  subscriptionId: string
  sellerId: string
  availableSlots: number
  pricePerSlot: number
  description?: string
  requirements?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  seller?: User
  subscription?: Subscription
}

export interface ServiceTemplate {
  id: string
  name: string
  category: string
  iconUrl: string
  defaultCost: number
  maxMembers: number
  billingCycles: string[]
  termsOfService?: string
  householdOnly?: boolean
  studentDiscount?: boolean
  isPopular: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  isStudent: boolean
  universityEmail?: string
}

// Configuration types
export interface AppConfig {
  apiUrl: string
  appEnv: 'development' | 'staging' | 'production'
  stripePublishableKey?: string
  paypalClientId?: string
  enableNotifications: boolean
  enableMarketplace: boolean
  enableStudentVerification: boolean
}

// Platform-specific types
export type Platform = 'web' | 'ios' | 'android'

export interface DeviceInfo {
  platform: Platform
  version: string
  deviceId: string
  pushToken?: string
}

// Theme types
export interface ThemeColors {
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
}

export interface Theme {
  colors: ThemeColors
  isDark: boolean
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined
  Main: undefined
  Onboarding: undefined
}

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  ResetPassword: { token: string }
}

export type MainTabParamList = {
  Dashboard: undefined
  Subscriptions: undefined
  Shares: undefined
  Payments: undefined
  Profile: undefined
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Subscription categories
export const SUBSCRIPTION_CATEGORIES = [
  'streaming',
  'music',
  'productivity',
  'education',
  'fitness',
  'gaming',
  'news',
  'cloud_storage',
  'design',
  'development',
  'other'
] as const

export type SubscriptionCategory = typeof SUBSCRIPTION_CATEGORIES[number]

// Billing cycles
export const BILLING_CYCLES = [
  'monthly',
  'yearly', 
  'weekly',
  'daily'
] as const

export type BillingCycle = typeof BILLING_CYCLES[number]

// Payment statuses
export const PAYMENT_STATUSES = [
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
] as const

export type PaymentStatus = typeof PAYMENT_STATUSES[number]

// Share statuses
export const SHARE_STATUSES = [
  'pending',
  'active',
  'declined',
  'removed'
] as const

export type ShareStatus = typeof SHARE_STATUSES[number] 