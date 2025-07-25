import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Bell,
  Plus,
  ArrowRight,
  Share2,
  Wallet
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalSubscriptions: number
  sharedSubscriptions: number
  monthlySavings: number
  totalMembers: number
}

interface UpcomingRenewal {
  id: string
  name: string
  renewalDate: string
  amount: number
  status: string
}

interface PendingPayment {
  id: string
  subscriptionName: string
  amount: number
  dueDate: string
  payee: string
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [upcomingRenewals, setUpcomingRenewals] = useState<UpcomingRenewal[]>([])
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:8000/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const statsData = await statsResponse.json()
      if (statsData.success) {
        setStats(statsData.data)
      }

      // Fetch upcoming renewals
      const renewalsResponse = await fetch('http://localhost:8000/api/dashboard/renewals', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const renewalsData = await renewalsResponse.json()
      if (renewalsData.success) {
        setUpcomingRenewals(renewalsData.data.data || [])
      }

      // Fetch pending payments
      const paymentsResponse = await fetch('http://localhost:8000/api/dashboard/pending-payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const paymentsData = await paymentsResponse.json()
      if (paymentsData.success) {
        setPendingPayments(paymentsData.data.data || [])
      }

      // Fetch recent activity
      const activityResponse = await fetch('http://localhost:8000/api/dashboard/activity', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const activityData = await activityResponse.json()
      if (activityData.success) {
        setRecentActivity(activityData.data.data || [])
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'My Subscriptions',
      value: stats?.totalSubscriptions || 0,
      icon: CreditCard,
      color: 'bg-blue-500',
      change: '+2 this month',
      link: '/subscriptions'
    },
    {
      title: 'Shared with Me',
      value: stats?.sharedSubscriptions || 0,
      icon: Share2,
      color: 'bg-green-500',
      change: '+1 this week',
      link: '/shares'
    },
    {
      title: 'Monthly Savings',
      value: `$${stats?.monthlySavings?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+$3.45 vs last month',
      link: '/payments'
    },
    {
      title: 'Total Members',
      value: stats?.totalMembers || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '5 active members',
      link: '/subscriptions'
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-primary-100">
              {user?.isStudent ? '🎓 Student account' : '👨‍👩‍👧‍👦 Family account'} • 
              You're saving money by sharing subscriptions with others
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/subscriptions/new"
              className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Subscription</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.change}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Renewals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Renewals</h2>
              <Link 
                to="/subscriptions" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {upcomingRenewals.length > 0 ? (
              <div className="space-y-4">
                {upcomingRenewals.slice(0, 3).map((renewal) => (
                  <div key={renewal.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{renewal.name}</p>
                        <p className="text-sm text-gray-500">
                          Due {formatDate(renewal.renewalDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${renewal.amount}</p>
                      <p className="text-xs text-gray-500">{renewal.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming renewals</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Payments</h2>
              <Link 
                to="/payments" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {pendingPayments.length > 0 ? (
              <div className="space-y-4">
                {pendingPayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{payment.subscriptionName}</p>
                        <p className="text-sm text-gray-500">
                          To {payment.payee} • Due {formatDate(payment.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${payment.amount}</p>
                      <button className="text-xs text-primary-600 hover:text-primary-700">
                        Pay now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pending payments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-xs text-gray-400 mt-1">Activity will appear here as you use Passio</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/subscriptions/new"
            className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <Plus className="h-6 w-6 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">Add Subscription</p>
              <p className="text-sm text-gray-600">Share a new service</p>
            </div>
          </Link>
          
          <Link
            to="/shares"
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Share2 className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Browse Shares</p>
              <p className="text-sm text-gray-600">Find services to join</p>
            </div>
          </Link>
          
          <Link
            to="/payments"
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Wallet className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Manage Payments</p>
              <p className="text-sm text-gray-600">View payment history</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 