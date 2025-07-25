import React from 'react'
import { ShoppingCart, Search } from 'lucide-react'

const MarketplacePage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-600 mt-1">Find available subscription slots from other users</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketplace coming soon</h3>
        <p className="text-gray-600 mb-6">The subscription marketplace will allow you to find and join subscription slots shared by other users.</p>
      </div>
    </div>
  )
}

export default MarketplacePage 