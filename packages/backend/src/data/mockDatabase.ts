// Mock database service for demo purposes
import { 
  testUsers, 
  testSubscriptions, 
  testShares, 
  testPayments, 
  testFriends, 
  testCredentials 
} from './testData'
import { User, Subscription, SubscriptionShare, Payment, Friend } from '../types'
import bcrypt from 'bcryptjs'

// In-memory data store
let users = [...testUsers]
let subscriptions = [...testSubscriptions]
let shares = [...testShares]
let payments = [...testPayments]
let friends = [...testFriends]
let credentials = { ...testCredentials }

// Helper function to generate IDs
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to add user data to subscriptions and shares
function enrichSubscriptionData(subscription: Subscription): any {
  const owner = users.find(u => u.id === subscription.owner_id)
  const subShares = shares.filter(s => s.subscription_id === subscription.id)
  const enrichedShares = subShares.map(share => ({
    ...share,
    user: users.find(u => u.id === share.user_id)
  }))
  
  return {
    ...subscription,
    owner,
    shares: enrichedShares,
    currentMembers: enrichedShares.filter(s => s.status === 'active').length + 1, // +1 for owner
    totalCost: subscription.monthly_cost,
    costPerMember: subscription.monthly_cost / (enrichedShares.filter(s => s.status === 'active').length + 1)
  }
}

// User operations
export const mockUserDB = {
  async findByEmail(email: string): Promise<User | null> {
    return users.find(u => u.email === email) || null
  },

  async findById(id: string): Promise<User | null> {
    return users.find(u => u.id === id) || null
  },

  async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password_hash || 'password123', 10)
    
    const newUser: User = {
      id: generateId('user'),
      email: userData.email!,
      password_hash: hashedPassword,
      first_name: userData.first_name!,
      last_name: userData.last_name!,
      phone: userData.phone,
      is_verified: true, // Auto-verify for demo
      is_student: userData.is_student || false,
      university_email: userData.university_email,
      profile_image_url: userData.profile_image_url || `https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=3b82f6&color=ffffff`,
      created_at: new Date(),
      updated_at: new Date()
    }

    users.push(newUser)
    return newUser
  },

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = users.findIndex(u => u.id === id)
    if (userIndex === -1) return null

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updated_at: new Date()
    }

    return users[userIndex]
  },

  async verifyPassword(user: User, password: string): Promise<boolean> {
    // For demo purposes, accept 'password123' for all test users
    return password === 'password123' || await bcrypt.compare(password, user.password_hash)
  }
}

// Subscription operations
export const mockSubscriptionDB = {
  async findByUserId(userId: string): Promise<any[]> {
    const userSubs = subscriptions.filter(s => s.owner_id === userId)
    return userSubs.map(enrichSubscriptionData)
  },

  async findById(id: string): Promise<any | null> {
    const subscription = subscriptions.find(s => s.id === id)
    return subscription ? enrichSubscriptionData(subscription) : null
  },

  async findSharedWithUser(userId: string): Promise<any[]> {
    const userShares = shares.filter(s => s.user_id === userId && s.status === 'active')
    const sharedSubs = userShares.map(share => 
      subscriptions.find(s => s.id === share.subscription_id)
    ).filter(Boolean) as Subscription[]
    
    return sharedSubs.map(enrichSubscriptionData)
  },

  async create(subData: Partial<Subscription>): Promise<any> {
    const newSubscription: Subscription = {
      id: generateId('sub'),
      owner_id: subData.owner_id!,
      name: subData.name!,
      description: subData.description,
      service_url: subData.service_url,
      icon_url: subData.icon_url,
      category: subData.category,
      monthly_cost: subData.monthly_cost!,
      billing_cycle: subData.billing_cycle || 'monthly',
      max_members: subData.max_members || 5,
      next_billing_date: subData.next_billing_date || new Date(),
      purchase_date: subData.purchase_date,
      notes: subData.notes,
      is_active: true,
      auto_renewal: subData.auto_renewal !== false,
      created_at: new Date(),
      updated_at: new Date()
    }

    subscriptions.push(newSubscription)
    return enrichSubscriptionData(newSubscription)
  },

  async getUpcomingRenewals(userId: string): Promise<any[]> {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    const userSubs = subscriptions.filter(s => 
      s.owner_id === userId && 
      new Date(s.next_billing_date) <= nextMonth
    )
    
    return userSubs.map(enrichSubscriptionData)
  }
}

// Share operations  
export const mockShareDB = {
  async findBySubscriptionId(subscriptionId: string): Promise<any[]> {
    const subscriptionShares = shares.filter(s => s.subscription_id === subscriptionId)
    return subscriptionShares.map(share => ({
      ...share,
      user: users.find(u => u.id === share.user_id)
    }))
  },

  async findById(id: string): Promise<SubscriptionShare | null> {
    return shares.find(s => s.id === id) || null
  },

  async findBySubscriptionAndUser(subscriptionId: string, userId: string): Promise<SubscriptionShare | null> {
    return shares.find(s => s.subscription_id === subscriptionId && s.user_id === userId) || null
  },

  async create(shareData: Partial<SubscriptionShare>): Promise<SubscriptionShare> {
    const newShare: SubscriptionShare = {
      id: generateId('share'),
      subscription_id: shareData.subscription_id!,
      user_id: shareData.user_id!,
      role: shareData.role || 'member',
      share_percentage: shareData.share_percentage || 0,
      fixed_amount: shareData.fixed_amount || 0,
      status: shareData.status || 'pending',
      invited_by: shareData.invited_by,
      invited_at: shareData.invited_at || new Date(),
      accepted_at: shareData.accepted_at,
      access_expires_at: shareData.access_expires_at,
      permissions: shareData.permissions,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    shares.push(newShare)
    return newShare
  },

  async updateStatus(id: string, status: 'pending' | 'active' | 'declined' | 'removed'): Promise<SubscriptionShare | null> {
    const shareIndex = shares.findIndex(s => s.id === id)
    if (shareIndex === -1) return null

    shares[shareIndex] = {
      ...shares[shareIndex],
      status,
      accepted_at: status === 'active' ? new Date() : shares[shareIndex].accepted_at,
      updated_at: new Date()
    }
    return shares[shareIndex]
  }
}

// Payment operations
export const mockPaymentDB = {
  async findByUserId(userId: string): Promise<any[]> {
    const userPayments = payments.filter(p => 
      p.payer_id === userId
    )
    
    return userPayments.map(payment => ({
      ...payment,
      payer: users.find(u => u.id === payment.payer_id),
      subscription: subscriptions.find(s => s.id === payment.subscription_id)
    }))
  },

  async findPendingByUserId(userId: string): Promise<any[]> {
    const pendingPayments = payments.filter(p => 
      p.payer_id === userId && p.status === 'pending'
    )
    
    return pendingPayments.map(payment => ({
      ...payment,
      payer: users.find(u => u.id === payment.payer_id),
      subscription: subscriptions.find(s => s.id === payment.subscription_id)
    }))
  },

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const newPayment: Payment = {
      id: generateId('payment'),
      subscription_id: paymentData.subscription_id!,
      payer_id: paymentData.payer_id!,
      amount: paymentData.amount!,
      currency: paymentData.currency || 'USD',
      status: 'pending',
      payment_method: paymentData.payment_method || 'stripe',
      billing_period_start: paymentData.billing_period_start!,
      billing_period_end: paymentData.billing_period_end!,
      due_date: paymentData.due_date!,
      created_at: new Date(),
      updated_at: new Date()
    }

    payments.push(newPayment)
    return newPayment
  }
}

// Friend operations  
export const mockFriendDB = {
  async findByUserId(userId: string): Promise<any[]> {
    const userFriends = friends.filter(f => 
      (f.user_id === userId || f.friend_id === userId) && f.status === 'accepted'
    )
    
    return userFriends.map(friend => {
      const friendUserId = friend.user_id === userId ? friend.friend_id : friend.user_id
      return {
        ...friend,
        friend: users.find(u => u.id === friendUserId)
      }
    })
  },

  async findRequests(userId: string): Promise<any[]> {
    const requests = friends.filter(f => 
      f.friend_id === userId && f.status === 'pending'
    )
    
    return requests.map(request => ({
      ...request,
      friend: users.find(u => u.id === request.user_id)
    }))
  }
}

// Credentials operations (encrypted in real app)
export const mockCredentialsDB = {
  async getBySubscriptionId(subscriptionId: string): Promise<any> {
    return credentials[subscriptionId] || null
  },

  async store(subscriptionId: string, credentialData: any): Promise<void> {
    credentials[subscriptionId] = credentialData
  }
}

// Dashboard stats
export const mockDashboardDB = {
  async getStats(userId: string) {
    const userSubs = subscriptions.filter(s => s.owner_id === userId)
    const sharedSubs = shares.filter(s => s.user_id === userId && s.status === 'active')
    
    const monthlySpend = userSubs.reduce((sum, sub) => sum + sub.monthly_cost, 0)
    const monthlySavings = sharedSubs.reduce((sum, share) => {
      const sub = subscriptions.find(s => s.id === share.subscription_id)
      return sum + (sub ? sub.monthly_cost * (share.share_percentage / 100) : 0)
    }, 0)

    return {
      totalSubscriptions: userSubs.length,
      totalSharedSubscriptions: sharedSubs.length,
      monthlySpend,
      monthlySavings,
      upcomingRenewals: userSubs.filter(s => {
        const daysUntilRenewal = Math.ceil((new Date(s.next_billing_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return daysUntilRenewal <= 7
      }).length,
      pendingPayments: payments.filter(p => p.payer_id === userId && p.status === 'pending').length,
      recentActivity: [
        {
          id: 'activity-1',
          type: 'payment',
          title: 'Payment completed',
          description: 'Netflix subscription payment processed',
          timestamp: new Date().toISOString()
        },
        {
          id: 'activity-2',
          type: 'share',
          title: 'New share request',
          description: 'Bob invited you to share Spotify',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  }
} 