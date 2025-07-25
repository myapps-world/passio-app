import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, EyeOff, Users, Calendar, DollarSign, Settings, Share2, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import InviteMemberModal from '../components/modals/InviteMemberModal'

interface Subscription {
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
  shares: Array<{
    id: string
    user_id: string
    role: string
    status: string
    user: {
      first_name: string
      last_name: string
      email: string
      profile_image_url?: string
    }
  }>
}

interface Credentials {
  email?: string
  password?: string
  profiles?: string[]
  note?: string
  workspace?: string
}

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
  const [credentials, setCredentials] = useState<Record<string, Credentials>>({})
  const [inviteModal, setInviteModal] = useState<{
    isOpen: boolean
    subscriptionId: string
    subscriptionName: string
    monthlyCost: number
  }>({
    isOpen: false,
    subscriptionId: '',
    subscriptionName: '',
    monthlyCost: 0
  })

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:8000/api/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setSubscriptions(data.data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
      toast.error('Failed to load subscriptions')
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

  const openInviteModal = (subscription: Subscription) => {
    setInviteModal({
      isOpen: true,
      subscriptionId: subscription.id,
      subscriptionName: subscription.name,
      monthlyCost: subscription.monthly_cost
    })
  }

  const closeInviteModal = () => {
    setInviteModal({
      isOpen: false,
      subscriptionId: '',
      subscriptionName: '',
      monthlyCost: 0
    })
  }

  const handleInviteSuccess = () => {
    // Refresh subscriptions to show updated member list
    fetchSubscriptions()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
          <p className="text-gray-600 mt-1">
            {subscriptions.length > 0 
              ? `Managing ${subscriptions.length} subscription${subscriptions.length > 1 ? 's' : ''}`
              : 'Start by adding your first subscription'
            }
          </p>
        </div>
        <Link to="/subscriptions/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscriptions yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first subscription to begin sharing and saving money.</p>
          <Link to="/subscriptions/new" className="btn-primary">
            Add Your First Subscription
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      {subscription.iconUrl ? (
                        <img src={subscription.iconUrl} alt={subscription.name} className="w-8 h-8" />
                      ) : (
                        <span className="text-white font-bold text-xl">{subscription.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{subscription.name}</h3>
                      <p className="text-gray-600">{subscription.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${subscription.monthly_cost}/month
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
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fetchCredentials(subscription.id)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Lock className="h-4 w-4" />
                      <span>{showCredentials[subscription.id] ? 'Hide' : 'View'} Credentials</span>
                    </button>
                    <button className="btn-secondary">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Credentials Section */}
              {showCredentials[subscription.id] && credentials[subscription.id] && (
                <div className="p-6 bg-yellow-50 border-b border-yellow-200">
                  <div className="flex items-center mb-4">
                    <Lock className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-medium text-yellow-800">Login Credentials</h4>
                    <span className="ml-auto text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                      View expires in 24h
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {credentials[subscription.id].email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email/Username</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={credentials[subscription.id].email}
                            readOnly
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(credentials[subscription.id].email!)
                              toast.success('Email copied!')
                            }}
                            className="btn-secondary text-xs"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                    {credentials[subscription.id].password && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="password"
                            value={credentials[subscription.id].password}
                            readOnly
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(credentials[subscription.id].password!)
                              toast.success('Password copied!')
                            }}
                            className="btn-secondary text-xs"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {credentials[subscription.id].profiles && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Profiles</label>
                      <div className="flex flex-wrap gap-2">
                        {credentials[subscription.id].profiles!.map((profile, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {profile}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {credentials[subscription.id].note && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Important Notes</label>
                      <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                        {credentials[subscription.id].note}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Members Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Shared with ({subscription.shares.length})</h4>
                  <button 
                    onClick={() => openInviteModal(subscription)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Invite Member</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscription.shares.map((share) => (
                    <div key={share.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {share.user.first_name[0]}{share.user.last_name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {share.user.first_name} {share.user.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{share.user.email}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          share.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {share.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={inviteModal.isOpen}
        onClose={closeInviteModal}
        subscriptionId={inviteModal.subscriptionId}
        subscriptionName={inviteModal.subscriptionName}
        monthlyCost={inviteModal.monthlyCost}
        onSuccess={handleInviteSuccess}
      />
    </div>
  )
}

export default SubscriptionsPage 