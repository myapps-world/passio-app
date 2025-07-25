import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { mockUserDB } from '../data/mockDatabase'

const JWT_SECRET = process.env.JWT_SECRET || 'demo-jwt-secret-key'

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await mockUserDB.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Verify password
    const isValidPassword = await mockUserDB.verifyPassword(user, password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      isStudent, 
      universityEmail 
    } = req.body

    // Check if user already exists
    const existingUser = await mockUserDB.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Create new user
    const newUser = await mockUserDB.create({
      email,
      password_hash: password, // Will be hashed in mockUserDB.create
      first_name: firstName,
      last_name: lastName,
      phone,
      is_student: isStudent,
      university_email: universityEmail
    })

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = newUser

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Registration successful'
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }

    const user = await mockUserDB.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId
    const updates = req.body

    const updatedUser = await mockUserDB.update(userId, updates)
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = updatedUser

    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export const socialAuth = async (req: Request, res: Response) => {
  try {
    const { userData, token, provider } = req.body

    console.log('Social auth attempt:', { provider, email: userData.email })

    // In production, verify the token with the provider
    // For demo, we'll create or find the user
    
    let user = await mockUserDB.findByEmail(userData.email)
    
    if (user) {
      // User exists, update with social info if needed
      const updatedUser = await mockUserDB.update(user.id, {
        profile_image_url: userData.profileImageUrl,
        is_verified: userData.isVerified || user.is_verified
      })
      user = updatedUser || user
    } else {
      // Create new user from social data
      const newUserData = {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        is_verified: userData.isVerified || true, // Social logins are typically verified
        is_student: userData.isStudent || false,
        university_email: userData.universityEmail,
        profile_image_url: userData.profileImageUrl,
        password: 'social-auth-' + provider, // Placeholder password for social users
        provider: provider,
        provider_id: userData.providerId
      }
      
      user = await mockUserDB.create(newUserData)
    }

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create or find user'
      })
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      data: {
        user,
        token: jwtToken
      },
      message: `${provider} authentication successful`
    })
  } catch (error) {
    console.error('Social auth error:', error)
    res.status(500).json({
      success: false,
      message: 'Social authentication failed'
    })
  }
}
