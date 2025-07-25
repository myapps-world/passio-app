import express from 'express'
import { authMiddleware } from '../middleware/auth'
import { mockDashboardDB, mockSubscriptionDB, mockPaymentDB } from '../data/mockDatabase'

const router = express.Router()

// Get dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const stats = await mockDashboardDB.getStats(userId)
    
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
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

// Get pending payments
router.get('/pending-payments', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const pendingPayments = await mockPaymentDB.findPendingByUserId(userId)
    
    res.json({
      success: true,
      data: pendingPayments
    })
  } catch (error) {
    console.error('Get pending payments error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get recent activity
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    
    // Mock recent activity data
    const activities = [
      {
        id: 'activity-1',
        type: 'payment',
        title: 'Payment received',
        description: 'Bob paid $3.87 for Netflix',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'activity-2',
        type: 'share',
        title: 'Share request accepted',
        description: 'Carol joined your Netflix subscription',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'activity-3',
        type: 'subscription',
        title: 'Subscription added',
        description: 'You added Disney+ Bundle',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'activity-4',
        type: 'friend',
        title: 'New friend',
        description: 'Emma Taylor added you as a friend',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ].slice(0, limit)
    
    res.json({
      success: true,
      data: activities
    })
  } catch (error) {
    console.error('Get activity error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 