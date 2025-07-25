import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import FacebookLogin from 'react-facebook-login-component'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

interface SocialLoginProps {
  mode: 'login' | 'register'
}

const SocialLogin: React.FC<SocialLoginProps> = ({ mode }) => {
  const { loginWithSocial } = useAuth()

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log('Google login success:', credentialResponse)
      
      // For demo purposes, we'll decode the JWT token client-side
      // In production, send the token to backend for verification
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
      
      const userData = {
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        profileImageUrl: decoded.picture,
        isVerified: decoded.email_verified,
        provider: 'google',
        providerId: decoded.sub
      }

      await loginWithSocial(userData, credentialResponse.credential)
      toast.success(`${mode === 'login' ? 'Logged in' : 'Registered'} with Google successfully!`)
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Google authentication failed')
    }
  }

  const handleGoogleError = () => {
    console.error('Google login failed')
    toast.error('Google authentication failed')
  }

  const handleFacebookResponse = async (response: any) => {
    try {
      console.log('Facebook login response:', response)
      
      if (response.accessToken) {
        const userData = {
          email: response.email,
          firstName: response.name.split(' ')[0],
          lastName: response.name.split(' ').slice(1).join(' '),
          profileImageUrl: response.picture?.data?.url,
          isVerified: true, // Facebook emails are typically verified
          provider: 'facebook',
          providerId: response.id
        }

        await loginWithSocial(userData, response.accessToken)
        toast.success(`${mode === 'login' ? 'Logged in' : 'Registered'} with Facebook successfully!`)
      }
    } catch (error) {
      console.error('Facebook login error:', error)
      toast.error('Facebook authentication failed')
    }
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or {mode} with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Google Login */}
        <div className="w-full">
          {googleClientId && googleClientId !== 'your-google-client-id.apps.googleusercontent.com' ? (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
              text={mode === 'login' ? 'signin_with' : 'signup_with'}
            />
          ) : (
            <button
              onClick={() => {
                // Demo mode - simulate Google login
                const demoGoogleUser = {
                  email: 'demo.google@gmail.com',
                  firstName: 'Google',
                  lastName: 'User',
                  profileImageUrl: 'https://lh3.googleusercontent.com/a/default-user',
                  isVerified: true,
                  provider: 'google',
                  providerId: 'demo-google-123'
                }
                loginWithSocial(demoGoogleUser, 'demo-google-token')
                toast.success('Demo Google login successful!')
              }}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {mode === 'login' ? 'Sign in' : 'Sign up'} with Google (Demo)
            </button>
          )}
        </div>

        {/* Facebook Login */}
        <div className="w-full">
          {facebookAppId && facebookAppId !== 'your-facebook-app-id' ? (
            <FacebookLogin
              appId={facebookAppId}
              callback={handleFacebookResponse}
              fields="name,email,picture"
              render={(renderProps: any) => (
                <button
                  onClick={renderProps.onClick}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {mode === 'login' ? 'Sign in' : 'Sign up'} with Facebook
                </button>
              )}
            />
          ) : (
            <button
              onClick={() => {
                // Demo mode - simulate Facebook login
                const demoFacebookUser = {
                  email: 'demo.facebook@outlook.com',
                  firstName: 'Facebook',
                  lastName: 'User',
                  profileImageUrl: 'https://graph.facebook.com/demo/picture',
                  isVerified: true,
                  provider: 'facebook',
                  providerId: 'demo-facebook-456'
                }
                loginWithSocial(demoFacebookUser, 'demo-facebook-token')
                toast.success('Demo Facebook login successful!')
              }}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {mode === 'login' ? 'Sign in' : 'Sign up'} with Facebook (Demo)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialLogin 