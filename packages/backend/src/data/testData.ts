// Test data for Passio application demo
import { User, Subscription, SubscriptionShare, Payment, Friend } from '../types'

// Test Users
export const testUsers: User[] = [
  {
    id: 'user-1',
    email: 'alice.chen@university.edu',
    password_hash: '$2b$10$example_hash_1', // password: 'password123'
    first_name: 'Alice',
    last_name: 'Chen',
    phone: '+1 (555) 123-4567',
    is_verified: true,
    is_student: true,
    university_email: 'alice.chen@university.edu',
    profile_image_url: 'https://ui-avatars.com/api/?name=Alice+Chen&background=3b82f6&color=ffffff',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15')
  },
  {
    id: 'user-2',
    email: 'bob.johnson@gmail.com',
    password_hash: '$2b$10$example_hash_2', // password: 'password123'
    first_name: 'Bob',
    last_name: 'Johnson',
    phone: '+1 (555) 234-5678',
    is_verified: true,
    is_student: false,
    profile_image_url: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=22c55e&color=ffffff',
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-10')
  },
  {
    id: 'user-3',
    email: 'carol.davis@student.edu',
    password_hash: '$2b$10$example_hash_3', // password: 'password123'
    first_name: 'Carol',
    last_name: 'Davis',
    phone: '+1 (555) 345-6789',
    is_verified: true,
    is_student: true,
    university_email: 'carol.davis@student.edu',
    profile_image_url: 'https://ui-avatars.com/api/?name=Carol+Davis&background=f59e0b&color=ffffff',
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20')
  },
  {
    id: 'user-4',
    email: 'david.wilson@techcorp.com',
    password_hash: '$2b$10$example_hash_4', // password: 'password123'
    first_name: 'David',
    last_name: 'Wilson',
    phone: '+1 (555) 456-7890',
    is_verified: true,
    is_student: false,
    profile_image_url: 'https://ui-avatars.com/api/?name=David+Wilson&background=ef4444&color=ffffff',
    created_at: new Date('2024-01-25'),
    updated_at: new Date('2024-01-25')
  },
  {
    id: 'user-5',
    email: 'emma.taylor@college.edu',
    password_hash: '$2b$10$example_hash_5', // password: 'password123'
    first_name: 'Emma',
    last_name: 'Taylor',
    phone: '+1 (555) 567-8901',
    is_verified: true,
    is_student: true,
    university_email: 'emma.taylor@college.edu',
    profile_image_url: 'https://ui-avatars.com/api/?name=Emma+Taylor&background=8b5cf6&color=ffffff',
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01')
  }
]

// Test Subscriptions
export const testSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    owner_id: 'user-1',
    name: 'Netflix Premium',
    description: 'Family plan with 4K streaming and 4 simultaneous screens',
    service_url: 'https://netflix.com',
    icon_url: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2023.ico',
    category: 'streaming',
    monthly_cost: 15.49,
    billing_cycle: 'monthly',
    max_members: 4,
    next_billing_date: new Date('2024-03-15'),
    purchase_date: new Date('2024-01-15'),
    notes: 'Family account - please don\'t change profile settings',
    is_active: true,
    auto_renewal: true,
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15')
  },
  {
    id: 'sub-2',
    owner_id: 'user-2',
    name: 'Spotify Family',
    description: 'Premium family plan with ad-free music streaming',
    service_url: 'https://spotify.com',
    icon_url: 'https://open.spotifycdn.com/cdn/images/favicon32.8e66b099.png',
    category: 'music',
    monthly_cost: 16.99,
    billing_cycle: 'monthly',
    max_members: 6,
    next_billing_date: new Date('2024-03-10'),
    purchase_date: new Date('2024-01-10'),
    notes: 'Feel free to create your own playlists',
    is_active: true,
    auto_renewal: true,
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-10')
  },
  {
    id: 'sub-3',
    owner_id: 'user-3',
    name: 'Adobe Creative Cloud',
    description: 'Student discount - All Creative Cloud apps',
    service_url: 'https://creative.adobe.com',
    icon_url: 'https://www.adobe.com/favicon.ico',
    category: 'design',
    monthly_cost: 19.99,
    billing_cycle: 'monthly',
    max_members: 1,
    next_billing_date: new Date('2024-03-20'),
    purchase_date: new Date('2024-01-20'),
    notes: 'Student pricing - verification required',
    is_active: true,
    auto_renewal: true,
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20')
  },
  {
    id: 'sub-4',
    owner_id: 'user-4',
    name: 'Disney+ Bundle',
    description: 'Disney+, Hulu, and ESPN+ bundle',
    service_url: 'https://disneyplus.com',
    icon_url: 'https://static-assets.bamgrid.com/product/disneyplus/favicons/favicon.ico',
    category: 'streaming',
    monthly_cost: 19.99,
    billing_cycle: 'monthly',
    max_members: 4,
    next_billing_date: new Date('2024-03-25'),
    purchase_date: new Date('2024-01-25'),
    notes: 'Bundle includes Disney+, Hulu, and ESPN+',
    is_active: true,
    auto_renewal: true,
    created_at: new Date('2024-01-25'),
    updated_at: new Date('2024-01-25')
  },
  {
    id: 'sub-5',
    owner_id: 'user-5',
    name: 'Notion Pro',
    description: 'Pro plan for team collaboration and note-taking',
    service_url: 'https://notion.so',
    icon_url: 'https://www.notion.so/front-static/favicon.ico',
    category: 'productivity',
    monthly_cost: 8.00,
    billing_cycle: 'monthly',
    max_members: 5,
    next_billing_date: new Date('2024-03-01'),
    purchase_date: new Date('2024-02-01'),
    notes: 'Great for study groups and project collaboration',
    is_active: true,
    auto_renewal: true,
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01')
  }
]

// Test Subscription Shares - fixed to match correct interface
export const testShares: SubscriptionShare[] = [
  // Netflix shares
  {
    id: 'share-1',
    subscription_id: 'sub-1',
    user_id: 'user-2',
    role: 'member',
    share_percentage: 25,
    fixed_amount: 3.87,
    status: 'active',
    invited_by: 'user-1',
    invited_at: new Date('2024-01-15'),
    accepted_at: new Date('2024-01-16'),
    permissions: {
      can_view_credentials: true,
      can_modify_settings: false,
      can_invite_members: false,
      has_time_limit: false
    },
    created_at: new Date('2024-01-16'),
    updated_at: new Date('2024-01-16')
  },
  {
    id: 'share-2',
    subscription_id: 'sub-1',
    user_id: 'user-3',
    role: 'member',
    share_percentage: 25,
    fixed_amount: 3.87,
    status: 'active',
    invited_by: 'user-1',
    invited_at: new Date('2024-01-16'),
    accepted_at: new Date('2024-01-17'),
    permissions: {
      can_view_credentials: true,
      can_modify_settings: false,
      can_invite_members: false,
      has_time_limit: false
    },
    created_at: new Date('2024-01-17'),
    updated_at: new Date('2024-01-17')
  },
  {
    id: 'share-3',
    subscription_id: 'sub-1',
    user_id: 'user-4',
    role: 'member',
    share_percentage: 25,
    fixed_amount: 3.87,
    status: 'pending',
    invited_by: 'user-1',
    invited_at: new Date('2024-02-01'),
    permissions: {
      can_view_credentials: true,
      can_modify_settings: false,
      can_invite_members: false,
      has_time_limit: false
    },
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01')
  },
  // Spotify shares
  {
    id: 'share-4',
    subscription_id: 'sub-2',
    user_id: 'user-1',
    role: 'member',
    share_percentage: 20,
    fixed_amount: 3.40,
    status: 'active',
    invited_by: 'user-2',
    invited_at: new Date('2024-01-10'),
    accepted_at: new Date('2024-01-11'),
    permissions: {
      can_view_credentials: true,
      can_modify_settings: false,
      can_invite_members: false,
      has_time_limit: false
    },
    created_at: new Date('2024-01-11'),
    updated_at: new Date('2024-01-11')
  },
  {
    id: 'share-5',
    subscription_id: 'sub-2',
    user_id: 'user-5',
    role: 'member',
    share_percentage: 20,
    fixed_amount: 3.40,
    status: 'active',
    invited_by: 'user-2',
    invited_at: new Date('2024-02-01'),
    accepted_at: new Date('2024-02-02'),
    permissions: {
      can_view_credentials: true,
      can_modify_settings: false,
      can_invite_members: false,
      has_time_limit: false
    },
    created_at: new Date('2024-02-02'),
    updated_at: new Date('2024-02-02')
  },
  // Disney+ shares
  {
    id: 'share-6',
    subscription_id: 'sub-4',
    user_id: 'user-1',
    role: 'member',
    share_percentage: 33.33,
    fixed_amount: 6.66,
    status: 'active',
    invited_by: 'user-4',
    invited_at: new Date('2024-01-25'),
    accepted_at: new Date('2024-01-26'),
    permissions: {
      can_view_credentials: true,
      can_modify_settings: false,
      can_invite_members: false,
      has_time_limit: false
    },
    created_at: new Date('2024-01-26'),
    updated_at: new Date('2024-01-26')
  },
  // Notion shares
  {
    id: 'share-7',
    subscription_id: 'sub-5',
    user_id: 'user-1',
    role: 'member',
    share_percentage: 25,
    fixed_amount: 2.00,
    status: 'active',
    invited_by: 'user-5',
    invited_at: new Date('2024-02-02'),
    accepted_at: new Date('2024-02-03'),
    permissions: {
      can_view_credentials: true,
      can_modify_settings: false,
      can_invite_members: true,
      has_time_limit: false
    },
    created_at: new Date('2024-02-03'),
    updated_at: new Date('2024-02-03')
  }
]

// Test Payments - fixed to match correct interface
export const testPayments: Payment[] = [
  {
    id: 'payment-1',
    subscription_id: 'sub-1',
    payer_id: 'user-2',
    amount: 3.87,
    currency: 'USD',
    status: 'completed',
    payment_method: 'stripe',
    billing_period_start: new Date('2024-02-01'),
    billing_period_end: new Date('2024-02-29'),
    due_date: new Date('2024-02-15'),
    paid_at: new Date('2024-02-15'),
    metadata: { notes: 'Netflix February payment' },
    created_at: new Date('2024-02-15'),
    updated_at: new Date('2024-02-15')
  },
  {
    id: 'payment-2',
    subscription_id: 'sub-1',
    payer_id: 'user-3',
    amount: 3.87,
    currency: 'USD',
    status: 'completed',
    payment_method: 'paypal',
    billing_period_start: new Date('2024-02-01'),
    billing_period_end: new Date('2024-02-29'),
    due_date: new Date('2024-02-15'),
    paid_at: new Date('2024-02-15'),
    metadata: { notes: 'Netflix February payment' },
    created_at: new Date('2024-02-15'),
    updated_at: new Date('2024-02-15')
  },
  {
    id: 'payment-3',
    subscription_id: 'sub-2',
    payer_id: 'user-1',
    amount: 3.40,
    currency: 'USD',
    status: 'completed',
    payment_method: 'stripe',
    billing_period_start: new Date('2024-02-01'),
    billing_period_end: new Date('2024-02-29'),
    due_date: new Date('2024-02-10'),
    paid_at: new Date('2024-02-10'),
    metadata: { notes: 'Spotify February payment' },
    created_at: new Date('2024-02-10'),
    updated_at: new Date('2024-02-10')
  },
  {
    id: 'payment-4',
    subscription_id: 'sub-1',
    payer_id: 'user-4',
    amount: 3.87,
    currency: 'USD',
    status: 'pending',
    payment_method: 'stripe',
    billing_period_start: new Date('2024-03-01'),
    billing_period_end: new Date('2024-03-31'),
    due_date: new Date('2024-03-15'),
    metadata: { notes: 'Netflix March payment - pending approval' },
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01')
  }
]

// Test Friends
export const testFriends: Friend[] = [
  // Alice's friends
  {
    id: 'friend-1',
    user_id: 'user-1',
    friend_id: 'user-2',
    status: 'accepted',
    created_at: new Date('2024-01-16'),
    updated_at: new Date('2024-01-16')
  },
  {
    id: 'friend-2',
    user_id: 'user-1',
    friend_id: 'user-3',
    status: 'accepted',
    created_at: new Date('2024-01-17'),
    updated_at: new Date('2024-01-17')
  },
  {
    id: 'friend-3',
    user_id: 'user-1',
    friend_id: 'user-4',
    status: 'accepted',
    created_at: new Date('2024-01-26'),
    updated_at: new Date('2024-01-26')
  },
  {
    id: 'friend-4',
    user_id: 'user-1',
    friend_id: 'user-5',
    status: 'accepted',
    created_at: new Date('2024-02-03'),
    updated_at: new Date('2024-02-03')
  },
  // Bob's friends  
  {
    id: 'friend-5',
    user_id: 'user-2',
    friend_id: 'user-1',
    status: 'accepted',
    created_at: new Date('2024-01-16'),
    updated_at: new Date('2024-01-16')
  },
  {
    id: 'friend-6',
    user_id: 'user-2',
    friend_id: 'user-5',
    status: 'accepted',
    created_at: new Date('2024-02-02'),
    updated_at: new Date('2024-02-02')
  }
]

// Demo credentials (encrypted in real app)
export const testCredentials: Record<string, any> = {
  'sub-1': {
    email: 'alice.netflix@example.com',
    password: 'netflix123',
    profiles: ['Alice', 'Family1', 'Family2', 'Kids']
  },
  'sub-2': {
    email: 'bob.spotify@example.com',
    password: 'spotify456',
    note: 'Feel free to create your own playlists'
  },
  'sub-3': {
    email: 'carol.adobe@student.edu',
    password: 'adobe789',
    note: 'Student account - please verify enrollment annually'
  },
  'sub-4': {
    email: 'david.disney@example.com',
    password: 'disney321',
    note: 'Bundle includes Disney+, Hulu, and ESPN+'
  },
  'sub-5': {
    email: 'emma.notion@college.edu',
    password: 'notion654',
    workspace: 'Study Group 2024'
  }
} 