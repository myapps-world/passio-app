import React from 'react'
import { Settings, Bell, Shield, CreditCard } from 'lucide-react'

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <p className="text-gray-600">Configure your notification preferences</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          </div>
          <p className="text-gray-600">Manage your security settings</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          </div>
          <p className="text-gray-600">Manage your payment methods</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">General</h3>
          </div>
          <p className="text-gray-600">General application settings</p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 