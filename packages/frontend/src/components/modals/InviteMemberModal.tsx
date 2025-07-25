import React, { useState } from 'react'
import { X, Mail, DollarSign, Percent, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  subscriptionId: string
  subscriptionName: string
  monthlyCost: number
  onSuccess: () => void
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  subscriptionId,
  subscriptionName,
  monthlyCost,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    shareType: 'equal', // 'equal', 'fixed', 'percentage'
    fixedAmount: '',
    sharePercentage: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('authToken')
      const inviteData = {
        email: formData.email,
        sharePercentage: formData.shareType === 'percentage' ? parseFloat(formData.sharePercentage) : 0,
        fixedAmount: formData.shareType === 'fixed' ? parseFloat(formData.fixedAmount) : 
                    formData.shareType === 'equal' ? monthlyCost / 2 : 0, // Simple equal split for demo
        message: formData.message
      }

      const response = await fetch(`http://localhost:8000/api/subscriptions/${subscriptionId}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inviteData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message || 'Invitation sent successfully!')
        onSuccess()
        onClose()
        setFormData({
          email: '',
          shareType: 'equal',
          fixedAmount: '',
          sharePercentage: '',
          message: ''
        })
      } else {
        toast.error(data.message || 'Failed to send invitation')
      }
    } catch (error) {
      console.error('Invite error:', error)
      toast.error('Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const calculateSuggestedAmount = () => {
    if (formData.shareType === 'percentage' && formData.sharePercentage) {
      return (monthlyCost * parseFloat(formData.sharePercentage) / 100).toFixed(2)
    }
    if (formData.shareType === 'equal') {
      return (monthlyCost / 2).toFixed(2) // Simple 50/50 split for demo
    }
    return formData.fixedAmount
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Invite Member</h3>
                <p className="text-sm text-gray-600">Share {subscriptionName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="friend@example.com"
                  required
                />
              </div>
            </div>

            {/* Cost Sharing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Sharing
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shareType"
                    value="equal"
                    checked={formData.shareType === 'equal'}
                    onChange={handleInputChange}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Equal split: ${(monthlyCost / 2).toFixed(2)} each
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shareType"
                    value="fixed"
                    checked={formData.shareType === 'fixed'}
                    onChange={handleInputChange}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Fixed amount</span>
                </label>

                {formData.shareType === 'fixed' && (
                  <div className="ml-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="fixedAmount"
                        value={formData.fixedAmount}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        max={monthlyCost}
                        className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shareType"
                    value="percentage"
                    checked={formData.shareType === 'percentage'}
                    onChange={handleInputChange}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Percentage</span>
                </label>

                {formData.shareType === 'percentage' && (
                  <div className="ml-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Percent className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="sharePercentage"
                        value={formData.sharePercentage}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="50"
                      />
                    </div>
                    {formData.sharePercentage && (
                      <p className="mt-1 text-xs text-gray-500">
                        ≈ ${calculateSuggestedAmount()}/month
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Hey! Would you like to split this subscription with me?"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Invitation Summary</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Subscription: <span className="font-medium text-gray-900">{subscriptionName}</span></p>
                <p>Total cost: <span className="font-medium text-gray-900">${monthlyCost}/month</span></p>
                <p>Their share: <span className="font-medium text-gray-900">${calculateSuggestedAmount()}/month</span></p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={loading || !formData.email}
              >
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default InviteMemberModal 