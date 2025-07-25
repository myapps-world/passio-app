import React from 'react'
import { useParams } from 'react-router-dom'

const SubscriptionDetailPage: React.FC = () => {
  const { id } = useParams()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription Details</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription ID: {id}</h3>
        <p className="text-gray-600">Detailed subscription view coming soon...</p>
      </div>
    </div>
  )
}

export default SubscriptionDetailPage 