import api from './api'
import { SessionStorage } from 'quasar'

/**
 * Get user notifications
 * New API structure: { success: true, data: [...], message: "...", status_code: 200 }
 */
export async function getUserNotifications(userId) {
  try {
    const response = await api.post('/api/v1/showUserNotifications', {
      user_id: userId
    })
    // Extract notifications array from response.data.data
    return response.data?.data || response.data || []
  } catch (error) {
    console.error('Get notifications error:', error)
    throw error
  }
}

/**
 * Create notification
 */
export async function createNotification(userId, message) {
  try {
    const response = await api.post('/api/v1/notifications', {
      user_id: userId,
      message
    })
    return response.data
  } catch (error) {
    console.error('Create notification error:', error)
    throw error
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId) {
  try {
    const response = await api.delete(`/api/v1/notifications/${notificationId}`)
    return response.data
  } catch (error) {
    console.error('Delete notification error:', error)
    throw error
  }
}

