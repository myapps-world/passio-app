import express from 'express'
import { authMiddleware } from '../middleware/auth'
import { mockSubscriptionDB, mockShareDB, mockCredentialsDB, mockUserDB } from '../data/mockDatabase'

const router = express.Router()

// Get all subscriptions for the current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const subscriptions = await mockSubscriptionDB.findByUserId(userId)
    
    res.json({
      success: true,
      data: {
        data: subscriptions,
        pagination: {
          page: 1,
          limit: 20,
          total: subscriptions.length,
          pages: 1
        }
      }
    })
  } catch (error) {
    console.error('Get subscriptions error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get shared subscriptions for the current user
router.get('/shared', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const sharedSubscriptions = await mockSubscriptionDB.findSharedWithUser(userId)
    
    res.json({
      success: true,
      data: {
        data: sharedSubscriptions,
        pagination: {
          page: 1,
          limit: 20,
          total: sharedSubscriptions.length,
          pages: 1
        }
      }
    })
  } catch (error) {
    console.error('Get shared subscriptions error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get upcoming renewals
router.get('/renewals', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const renewals = await mockSubscriptionDB.getUpcomingRenewals(userId)
    
    res.json({
      success: true,
      data: renewals
    })
  } catch (error) {
    console.error('Get renewals error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get single subscription
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const subscription = await mockSubscriptionDB.findById(id)
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      })
    }
    
    res.json({
      success: true,
      data: subscription
    })
  } catch (error) {
    console.error('Get subscription error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Create new subscription
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const { credentials, ...subscriptionData } = req.body
    
    const newSubscription = await mockSubscriptionDB.create({
      ...subscriptionData,
      owner_id: userId
    })

    // Store credentials separately if provided
    if (credentials && newSubscription.id) {
      await mockCredentialsDB.store(newSubscription.id, credentials)
    }
    
    res.status(201).json({
      success: true,
      data: newSubscription,
      message: 'Subscription created successfully'
    })
  } catch (error) {
    console.error('Create subscription error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get subscription shares
router.get('/:id/shares', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const shares = await mockShareDB.findBySubscriptionId(id)
    
    res.json({
      success: true,
      data: shares
    })
  } catch (error) {
    console.error('Get shares error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get subscription credentials (demo - normally encrypted)
router.post('/:id/credentials', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const credentials = await mockCredentialsDB.getBySubscriptionId(id)
    
    if (!credentials) {
      return res.status(404).json({
        success: false,
        message: 'Credentials not found'
      })
    }
    
    res.json({
      success: true,
      data: { credentials }
    })
  } catch (error) {
    console.error('Get credentials error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Invite member to subscription
router.post('/:id/invite', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user?.userId
    const { email, sharePercentage, fixedAmount, message } = req.body
    
    // Find the user to invite
    const inviteeUser = await mockUserDB.findByEmail(email)
    if (!inviteeUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      })
    }
    
    // Check if subscription exists and user is owner
    const subscription = await mockSubscriptionDB.findById(id)
    if (!subscription || subscription.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to invite members to this subscription'
      })
    }
    
    // Check if user is already a member
    const existingShare = await mockShareDB.findBySubscriptionAndUser(id, inviteeUser.id)
    if (existingShare) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this subscription'
      })
    }
    
    // Create the invitation
    const newShare = await mockShareDB.create({
      subscription_id: id,
      user_id: inviteeUser.id,
      role: 'member',
      share_percentage: sharePercentage || 0,
      fixed_amount: fixedAmount || 0,
      status: 'pending',
      invited_by: userId,
      invited_at: new Date()
    })
    
    res.status(201).json({
      success: true,
      data: newShare,
      message: `Invitation sent to ${email}`
    })
  } catch (error) {
    console.error('Invite member error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Accept subscription invitation
router.post('/:id/shares/:shareId/accept', authMiddleware, async (req, res) => {
  try {
    const { id, shareId } = req.params
    const userId = (req as any).user?.userId
    
    const share = await mockShareDB.findById(shareId)
    if (!share || share.user_id !== userId || share.subscription_id !== id) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found or not authorized'
      })
    }
    
    if (share.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Invitation is no longer pending'
      })
    }
    
    const updatedShare = await mockShareDB.updateStatus(shareId, 'active')
    
    res.json({
      success: true,
      data: updatedShare,
      message: 'Invitation accepted successfully'
    })
  } catch (error) {
    console.error('Accept invitation error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Decline subscription invitation
router.post('/:id/shares/:shareId/decline', authMiddleware, async (req, res) => {
  try {
    const { id, shareId } = req.params
    const userId = (req as any).user?.userId
    
    const share = await mockShareDB.findById(shareId)
    if (!share || share.user_id !== userId || share.subscription_id !== id) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found or not authorized'
      })
    }
    
    if (share.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Invitation is no longer pending'
      })
    }
    
    const updatedShare = await mockShareDB.updateStatus(shareId, 'declined')
    
    res.json({
      success: true,
      data: updatedShare,
      message: 'Invitation declined'
    })
  } catch (error) {
    console.error('Decline invitation error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Remove member from subscription
router.delete('/:id/shares/:shareId', authMiddleware, async (req, res) => {
  try {
    const { id, shareId } = req.params
    const userId = (req as any).user?.userId
    
    const subscription = await mockSubscriptionDB.findById(id)
    const share = await mockShareDB.findById(shareId)
    
    if (!subscription || !share || share.subscription_id !== id) {
      return res.status(404).json({
        success: false,
        message: 'Subscription or share not found'
      })
    }
    
    // Only owner can remove members, or user can remove themselves
    if (subscription.owner_id !== userId && share.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove this member'
      })
    }
    
    const updatedShare = await mockShareDB.updateStatus(shareId, 'removed')
    
    res.json({
      success: true,
      message: 'Member removed successfully'
    })
  } catch (error) {
    console.error('Remove member error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 