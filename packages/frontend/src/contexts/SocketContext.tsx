import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

interface SocketContextType {
  socket: Socket | null
  connected: boolean
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  emit: (event: string, data: any) => void
}

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      initializeSocket()
    } else {
      disconnectSocket()
    }

    return () => {
      disconnectSocket()
    }
  }, [user])

  const initializeSocket = () => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
      auth: {
        token: localStorage.getItem('authToken')
      }
    })

    newSocket.on('connect', () => {
      console.log('Socket connected')
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setConnected(false)
    })

    // Real-time notifications
    newSocket.on('notification', (notification) => {
      toast(notification.message, {
        icon: getNotificationIcon(notification.type),
        duration: 5000
      })
    })

    // Subscription updates
    newSocket.on('subscription_updated', (data) => {
      toast.success(`Subscription "${data.name}" has been updated`)
    })

    // Payment notifications
    newSocket.on('payment_received', (data) => {
      toast.success(`Payment received from ${data.payer}: $${data.amount}`)
    })

    newSocket.on('payment_due', (data) => {
      toast(`Payment due for ${data.subscription}: $${data.amount}`, {
        icon: '💳',
        duration: 7000
      })
    })

    // Sharing notifications
    newSocket.on('share_request', (data) => {
      toast(`New share request for ${data.subscription}`, {
        icon: '🤝',
        duration: 6000
      })
    })

    newSocket.on('share_accepted', (data) => {
      toast.success(`Share request accepted for ${data.subscription}`)
    })

    // Security alerts
    newSocket.on('security_alert', (data) => {
      toast(data.message, {
        icon: '🔒',
        duration: 8000,
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fca5a5'
        }
      })
    })

    setSocket(newSocket)
  }

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setConnected(false)
    }
  }

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join_room', roomId)
    }
  }

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leave_room', roomId)
    }
  }

  const emit = (event: string, data: any) => {
    if (socket) {
      socket.emit(event, data)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💰'
      case 'renewal': return '🔄'
      case 'share': return '🤝'
      case 'security': return '🔒'
      case 'friend': return '👥'
      default: return '📱'
    }
  }

  const value: SocketContextType = {
    socket,
    connected,
    joinRoom,
    leaveRoom,
    emit
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
} 