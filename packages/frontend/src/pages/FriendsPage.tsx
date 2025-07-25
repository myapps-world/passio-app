import React from 'react'
import { Users, UserPlus } from 'lucide-react'

const FriendsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
          <p className="text-gray-600 mt-1">Connect with friends to share subscriptions</p>
        </div>
        <button className="btn-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Friend
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No friends added yet</h3>
        <p className="text-gray-600 mb-6">Add friends to start sharing subscriptions and save money together.</p>
        <button className="btn-primary">
          Add Your First Friend
        </button>
      </div>
    </div>
  )
}

export default FriendsPage 