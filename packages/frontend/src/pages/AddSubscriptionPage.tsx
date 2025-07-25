import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const AddSubscriptionPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceUrl: '',
    category: 'streaming',
    monthlyCost: '',
    billingCycle: 'monthly',
    maxMembers: '4',
    nextBillingDate: '',
    notes: '',
    credentials: {
      email: '',
      password: ''
    }
  })

  const categories = [
    { value: 'streaming', label: '📺 Streaming' },
    { value: 'music', label: '🎵 Music' },
    { value: 'productivity', label: '💼 Productivity' },
    { value: 'design', label: '🎨 Design' },
    { value: 'gaming', label: '🎮 Gaming' },
    { value: 'education', label: '📚 Education' },
    { value: 'cloud', label: '☁️ Cloud Storage' },
    { value: 'other', label: '📦 Other' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('credentials.')) {
      const credField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        credentials: {
          ...prev.credentials,
          [credField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('authToken')
      const subscriptionData = {
        name: formData.name,
        description: formData.description,
        serviceUrl: formData.serviceUrl,
        category: formData.category,
        monthlyCost: parseFloat(formData.monthlyCost),
        billingCycle: formData.billingCycle,
        maxMembers: parseInt(formData.maxMembers),
        nextBillingDate: formData.nextBillingDate,
        notes: formData.notes,
        credentials: formData.credentials
      }

      const response = await fetch('http://localhost:8000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriptionData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Subscription added successfully!')
        navigate('/subscriptions')
      } else {
        toast.error(data.message || 'Failed to add subscription')
      }
    } catch (error) {
      console.error('Failed to add subscription:', error)
      toast.error('Failed to add subscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/subscriptions')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subscriptions
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Subscription</h1>
        <p className="text-gray-600 mt-1">Create a new subscription to share with others</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Netflix Premium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brief description of the subscription plan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service URL
              </label>
              <input
                type="url"
                name="serviceUrl"
                value={formData.serviceUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://netflix.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Cost *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="monthlyCost"
                  value={formData.monthlyCost}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="15.99"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Cycle
              </label>
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Members
              </label>
              <input
                type="number"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleInputChange}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Billing Date
              </label>
              <input
                type="date"
                name="nextBillingDate"
                value={formData.nextBillingDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any important notes for members (e.g., usage guidelines, profile restrictions)"
              />
            </div>
          </div>
        </div>

        {/* Login Credentials */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 text-yellow-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Login Credentials</h2>
            <span className="ml-auto text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
              Encrypted & Secure
            </span>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              🔒 These credentials will be encrypted and only shared with approved members. 
              Members will need your permission to view login details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email/Username *
              </label>
              <input
                type="text"
                name="credentials.email"
                value={formData.credentials.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="credentials.password"
                  value={formData.credentials.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your account password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/subscriptions')}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Adding...' : 'Add Subscription'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddSubscriptionPage 