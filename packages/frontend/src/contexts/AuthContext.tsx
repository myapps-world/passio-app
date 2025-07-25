import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  loginWithSocial: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { provider: string; providerId: string }, token: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  isStudent?: boolean
  universityEmail?: string
}

// Helper function to map backend user data to frontend format
const mapBackendUserToFrontend = (backendUser: any): User => {
  return {
    id: backendUser.id,
    email: backendUser.email,
    firstName: backendUser.first_name || backendUser.firstName,
    lastName: backendUser.last_name || backendUser.lastName,
    phone: backendUser.phone,
    isVerified: backendUser.is_verified ?? backendUser.isVerified ?? false,
    isStudent: backendUser.is_student ?? backendUser.isStudent ?? false,
    universityEmail: backendUser.university_email || backendUser.universityEmail,
    profileImageUrl: backendUser.profile_image_url || backendUser.profileImageUrl,
    createdAt: backendUser.created_at || backendUser.createdAt,
    updatedAt: backendUser.updated_at || backendUser.updatedAt
  }
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        const response = await authApi.getCurrentUser()
        // Map backend response to frontend format
        const userData = mapBackendUserToFrontend(response)
        setUser(userData)
      }
    } catch (error) {
      localStorage.removeItem('authToken')
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      localStorage.setItem('authToken', response.token)
      // Map backend response to frontend format
      const userData = mapBackendUserToFrontend(response.user)
      setUser(userData)
      toast.success('Welcome back!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      // Map frontend data to backend format
      const backendData = {
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password, // Add required confirmPassword field
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        isStudent: userData.isStudent ?? false, // Provide default value
        universityEmail: userData.universityEmail
      }
      
      const response = await authApi.register(backendData)
      localStorage.setItem('authToken', response.token)
      // Map backend response to frontend format
      const user = mapBackendUserToFrontend(response.user)
      setUser(user)
      toast.success('Account created successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const loginWithSocial = async (
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { provider: string; providerId: string }, 
    token: string
  ) => {
    try {
      // For demo purposes, we'll create a mock social login
      // In production, send the token to backend for verification
      const response = await fetch('http://localhost:8000/api/auth/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userData,
          token,
          provider: userData.provider
        })
      })

      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('authToken', data.data.token)
        const user = mapBackendUserToFrontend(data.data.user)
        setUser(user)
      } else {
        throw new Error(data.message || 'Social authentication failed')
      }
    } catch (error: any) {
      console.error('Social login error:', error)
      
      // Fallback for demo - create a temporary user
      const demoUser: User = {
        id: `social-${userData.provider}-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        isVerified: userData.isVerified,
        isStudent: userData.isStudent ?? false,
        universityEmail: userData.universityEmail,
        profileImageUrl: userData.profileImageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Create a demo token
      const demoToken = `demo-${userData.provider}-token-${Date.now()}`
      localStorage.setItem('authToken', demoToken)
      setUser(demoUser)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser()
      // Map backend response to frontend format
      const userData = mapBackendUserToFrontend(response)
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    loginWithSocial,
    logout,
    updateUser,
    refreshUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 