export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_verified: boolean;
  verification_token?: string;
  reset_password_token?: string;
  reset_password_expires?: Date;
  is_student: boolean;
  university_email?: string;
  profile_image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_student?: boolean;
  university_email?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface Subscription {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  service_url?: string;
  icon_url?: string;
  category?: string;
  monthly_cost: number;
  billing_cycle: 'monthly' | 'yearly' | 'weekly' | 'daily';
  max_members: number;
  next_billing_date: Date;
  purchase_date?: Date;
  renewal_date?: Date;
  notes?: string;
  is_active: boolean;
  credentials_encrypted?: string;
  credentials_salt?: string;
  auto_renewal: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSubscriptionDto {
  name: string;
  description?: string;
  service_url?: string;
  icon_url?: string;
  category?: string;
  monthly_cost: number;
  billing_cycle?: 'monthly' | 'yearly' | 'weekly' | 'daily';
  max_members?: number;
  next_billing_date: string;
  purchase_date?: string;
  renewal_date?: string;
  notes?: string;
  credentials?: {
    username?: string;
    password?: string;
    other_fields?: Record<string, string>;
  };
  auto_renewal?: boolean;
}

export interface SubscriptionShare {
  id: string;
  subscription_id: string;
  user_id: string;
  role: 'owner' | 'member';
  share_percentage: number;
  fixed_amount: number;
  status: 'pending' | 'active' | 'declined' | 'removed';
  invited_by?: string;
  invited_at: Date;
  accepted_at?: Date;
  access_expires_at?: Date;
  permissions?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface CreateShareDto {
  subscription_id: string;
  user_email: string;
  role?: 'owner' | 'member';
  share_percentage?: number;
  fixed_amount?: number;
  permissions?: Record<string, any>;
  access_expires_at?: string;
}

export interface Payment {
  id: string;
  subscription_id: string;
  payer_id: string;
  amount: number;
  currency: string;
  stripe_payment_intent_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: 'stripe' | 'paypal' | 'manual';
  billing_period_start: Date;
  billing_period_end: Date;
  due_date: Date;
  paid_at?: Date;
  failed_at?: Date;
  failure_reason?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePaymentDto {
  subscription_id: string;
  amount: number;
  currency?: string;
  payment_method?: 'stripe' | 'paypal' | 'manual';
  billing_period_start: string;
  billing_period_end: string;
  due_date: string;
}

export interface Notification {
  id: string;
  user_id: string;
  subscription_id?: string;
  type: 'payment_due' | 'payment_received' | 'subscription_shared' | 'renewal_reminder' | 'security_alert' | 'general';
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expires_at?: Date;
  created_at: Date;
}

export interface CreateNotificationDto {
  user_id: string;
  subscription_id?: string;
  type: 'payment_due' | 'payment_received' | 'subscription_shared' | 'renewal_reminder' | 'security_alert' | 'general';
  title: string;
  message: string;
  action_url?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  expires_at?: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface SubscriptionWithMembers extends Subscription {
  members: Array<SubscriptionShare & { user: Pick<User, 'id' | 'first_name' | 'last_name' | 'email' | 'profile_image_url'> }>;
  owner: Pick<User, 'id' | 'first_name' | 'last_name' | 'email' | 'profile_image_url'>;
  pending_payments: Payment[];
  total_monthly_cost: number;
  your_share: number;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: Date;
  updated_at: Date;
}
