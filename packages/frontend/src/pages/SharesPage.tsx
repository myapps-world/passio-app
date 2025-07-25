import React, { useState, useEffect } from 'react'
import { Share2, Lock, Eye, EyeOff, DollarSign, Calendar, Users, Copy, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

interface SharedSubscription {
  id: string
  name: string
  description?: string
  iconUrl?: string
  category?: string
  monthly_cost: number
  billing_cycle: string
  max_members: number
  next_billing_date: string
  notes?: string
  is_active: boolean
  auto_renewal: boolean
  currentMembers: number
  totalCost: number
  costPerMember: number
  owner: {
    first_name: string
    last_name: string
    email: string
    profile_image_url?: string
  }
  shares: Array<{
    id: string
    user_id: string
    role: string
    status: string
    share_percentage: number
    fixed_amount: number
  }>
}

interface Credentials {
  email?: string
  password?: string
  profiles?: string[]
  note?: string
  workspace?: string
}

const SharesPage: React.FC = () => {
  const { user } = useAuth()
  const [sharedSubscriptions, setSharedSubscriptions] = useState<SharedSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
  const [credentials, setCredentials] = useState<Record<string, Credentials>>({})

  useEffect(() => {
    fetchSharedSubscriptions()
  }, [])

  const fetchSharedSubscriptions = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:8000/api/subscriptions/shared', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setSharedSubscriptions(data.data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch shared subscriptions:', error)
      toast.error('Failed to load shared subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const fetchCredentials = async (subscriptionId: string) => {
    if (credentials[subscriptionId]) {
      setShowCredentials(prev => ({ ...prev, [subscriptionId]: !prev[subscriptionId] }))
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8000/api/subscriptions/${subscriptionId}/credentials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success) {
        setCredentials(prev => ({ ...prev, [subscriptionId]: data.data.credentials }))
        setShowCredentials(prev => ({ ...prev, [subscriptionId]: true }))
        toast.success('Credentials loaded securely')
      }
    } catch (error) {
      console.error('Failed to fetch credentials:', error)
      toast.error('Failed to load credentials')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shared with Me</h1>
        <p className="text-gray-600 mt-1">
          {sharedSubscriptions.length > 0 
            ? `You have access to ${sharedSubscriptions.length} shared subscription${sharedSubscriptions.length > 1 ? 's' : ''}`
            : 'No shared subscriptions yet'
          }
        </p>
      </div>

      {sharedSubscriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No shared subscriptions</h3>
          <p className="text-gray-600 mb-6">You don't have any subscriptions shared with you yet. Ask friends and family to share their subscriptions!</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div className="text-left">
                <h4 className="text-sm font-medium text-blue-800">Get Started</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Connect with friends who have subscriptions they'd like to share, or check the marketplace for available spots.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sharedSubscriptions.map((subscription) => {
            // Find the current user's share
            const userShare = subscription.shares.find(share => share.user_id === user?.id)
            return (
              <div key={subscription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        {subscription.iconUrl ? (
                          <img src={subscription.iconUrl} alt={subscription.name} className="w-8 h-8" />
                        ) : (
                          <span className="text-white font-bold text-xl">{subscription.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-semibold text-gray-900">{subscription.name}</h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Shared
                          </span>
                        </div>
                        <p className="text-gray-600">{subscription.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Your share: ${userShare?.fixed_amount || (subscription.monthly_cost / subscription.currentMembers).toFixed(2)}/month
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {subscription.currentMembers}/{subscription.max_members} members
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Renews {formatDate(subscription.next_billing_date)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Shared by <span className="font-medium text-gray-700">
                              {subscription.owner.first_name} {subscription.owner.last_name}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => fetchCredentials(subscription.id)}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Lock className="h-4 w-4" />
                        <span>{showCredentials[subscription.id] ? 'Hide' : 'Get'} Access</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Credentials Section - THE CORE FEATURE */}
                {showCredentials[subscription.id] && credentials[subscription.id] && (
                  <div className="p-6 bg-green-50 border-b border-green-200">
                    <div className="flex items-center mb-4">
                      <Lock className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-green-800">🔐 Login Credentials</h4>
                      <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Secure Access • Expires in 24h
                      </span>
                    </div>

                    <div className="bg-white rounded-lg border-2 border-green-200 p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {credentials[subscription.id].email && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email/Username
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={credentials[subscription.id].email}
                                readOnly
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                              />
                              <button
                                onClick={() => copyToClipboard(credentials[subscription.id].email!, 'Email')}
                                className="btn-secondary text-xs flex items-center space-x-1"
                              >
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </button>
                            </div>
                          </div>
                        )}
                        {credentials[subscription.id].password && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Password
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="password"
                                value={credentials[subscription.id].password}
                                readOnly
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                              />
                              <button
                                onClick={() => copyToClipboard(credentials[subscription.id].password!, 'Password')}
                                className="btn-secondary text-xs flex items-center space-x-1"
                              >
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {credentials[subscription.id].profiles && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available Profiles
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {credentials[subscription.id].profiles!.map((profile, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {profile}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {credentials[subscription.id].workspace && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Workspace
                          </label>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                            {credentials[subscription.id].workspace}
                          </p>
                        </div>
                      )}

                      {credentials[subscription.id].note && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Important Notes
                          </label>
                          <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                            ⚠️ {credentials[subscription.id].note}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-green-700 bg-green-100 p-3 rounded">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>This access is tracked and will expire automatically. Please respect usage guidelines.</span>
                      </div>
                      <button
                        onClick={() => {
                          const creds = credentials[subscription.id]
                          const text = `${subscription.name} Login:\nEmail: ${creds.email}\nPassword: ${creds.password}`
                          copyToClipboard(text, 'All credentials')
                        }}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Copy All
                      </button>
                    </div>
                  </div>
                )}

                {/* Owner & Payment Info */}
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Subscription Owner</h5>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {subscription.owner.first_name[0]}{subscription.owner.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {subscription.owner.first_name} {subscription.owner.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{subscription.owner.email}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Your Payment</h5>
                      <div className="text-sm text-gray-600">
                        <p>Monthly share: <span className="font-medium text-gray-900">
                          ${userShare?.fixed_amount || (subscription.monthly_cost / subscription.currentMembers).toFixed(2)}
                        </span></p>
                        <p>Next payment: <span className="font-medium text-gray-900">
                          {formatDate(subscription.next_billing_date)}
                        </span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SharesPage 