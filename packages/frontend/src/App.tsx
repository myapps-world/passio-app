import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import AddSubscriptionPage from './pages/AddSubscriptionPage'
import SubscriptionDetailPage from './pages/SubscriptionDetailPage'
import SharesPage from './pages/SharesPage'
import PaymentsPage from './pages/PaymentsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

// Layout components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'

function App() {
  const { user } = useAuth()

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!user ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={user ? <ProtectedLayout><DashboardPage /></ProtectedLayout> : <Navigate to="/login" />} />
        <Route path="/subscriptions" element={user ? <ProtectedLayout><SubscriptionsPage /></ProtectedLayout> : <Navigate to="/login" />} />
        <Route path="/subscriptions/new" element={user ? <ProtectedLayout><AddSubscriptionPage /></ProtectedLayout> : <Navigate to="/login" />} />
        <Route path="/subscriptions/:id" element={user ? <ProtectedLayout><SubscriptionDetailPage /></ProtectedLayout> : <Navigate to="/login" />} />
        <Route path="/shares" element={user ? <ProtectedLayout><SharesPage /></ProtectedLayout> : <Navigate to="/login" />} />
        <Route path="/payments" element={user ? <ProtectedLayout><PaymentsPage /></ProtectedLayout> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProtectedLayout><ProfilePage /></ProtectedLayout> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <ProtectedLayout><SettingsPage /></ProtectedLayout> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* Fixed spacing for sidebar on medium screens and up */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App 