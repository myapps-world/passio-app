import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from 'react-query'
import Toast from 'react-native-toast-message'

import AppNavigator from './src/navigation/AppNavigator'
import { AuthProvider } from './src/contexts/AuthContext'
import { SocketProvider } from './src/contexts/SocketContext'
import { ThemeProvider } from './src/contexts/ThemeContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 0,
    },
  },
})

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <NavigationContainer>
                <AppNavigator />
                <StatusBar style="auto" />
                <Toast />
              </NavigationContainer>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
} 