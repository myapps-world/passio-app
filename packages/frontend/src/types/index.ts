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

export interface Budget {
  id: string
  userId: string
  monthlyLimit: number
  currentSpend: number
  currency: string
  notifications: boolean
  createdAt: string
  updatedAt: string
}

export interface AuditLog {
  id: string
  userId: string
  subscriptionId?: string
  action: string
  details: any
  ipAddress?: string
  userAgent?: string
  createdAt: string
  user?: User
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

export interface SubscriptionForm {
  name: string
  description?: string
  serviceUrl?: string
  category: string
  monthlyCost: number
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily'
  maxMembers: number
  nextBillingDate: string
  notes?: string
  credentials?: {
    username?: string
    email?: string
    password?: string
  }
}

export interface ShareInviteForm {
  emails: string[]
  message?: string
  permissions: SharePermissions
  customShare?: number
}

export interface PaymentForm {
  amount: number
  subscriptionId: string
  paymentMethod: 'stripe' | 'paypal'
}

// Dashboard stats
export interface DashboardStats {
  totalSubscriptions: number
  totalSharedSubscriptions: number
  monthlySpend: number
  monthlySavings: number
  upcomingRenewals: number
  pendingPayments: number
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: 'subscription' | 'payment' | 'share' | 'friend'
  title: string
  description: string
  timestamp: string
  metadata?: any
} 