import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  CreditCard,
  Share2,
  Wallet,
  User,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  description?: string
}

// Keep only working core features
const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and statistics'
  },
  {
    name: 'My Subscriptions',
    href: '/subscriptions',
    icon: CreditCard,
    description: 'Manage your subscriptions'
  },
  {
    name: 'Shared with Me',
    href: '/shares',
    icon: Share2,
    description: 'Subscriptions shared by others'
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: Wallet,
    description: 'Payment history'
  }
]

const bottomNavigation: NavItem[] = [
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Your profile settings'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App preferences'
  }
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
    const active = isActive(item.href)
    
    return (
      <Link
        to={item.href}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          active
            ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        title={item.description}
      >
        <item.icon
          className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
            active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
          }`}
        />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile sidebar background */}
      <div className="md:hidden fixed inset-0 z-40 lg:hidden" aria-hidden="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      </div>

      {/* Sidebar */}
      <div className={`hidden md:flex ${isCollapsed ? 'md:w-16' : 'md:w-64'} md:flex-col md:fixed md:inset-y-0 transition-all duration-300 z-50`}>
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-sm">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo and Collapse Button */}
            <div className="flex items-center justify-between flex-shrink-0 px-4 mb-8">
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Passio</h1>
                    <p className="text-xs text-gray-500">Smart Sharing</p>
                  </div>
                </div>
              )}
              {isCollapsed && (
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 space-y-1">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="space-y-1">
                  {bottomNavigation.map((item) => (
                    <NavLink key={item.name} item={item} />
                  ))}
                </div>
              </div>

              {/* Quick Stats - only show when not collapsed */}
              {!isCollapsed && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="px-3 mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quick Stats
                    </h3>
                  </div>
                  <div className="space-y-3 px-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">My Subscriptions</span>
                      <span className="font-medium text-gray-900">1</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Shared Count</span>
                      <span className="font-medium text-primary-600">3</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Monthly Savings</span>
                      <span className="font-medium text-green-600">$12.06</span>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 