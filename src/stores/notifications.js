import { defineStore } from 'pinia'
import { SessionStorage } from 'quasar'
import * as notificationsService from 'src/services/notificationsService'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    isLoading: false
  }),

  getters: {
    hasNotifications: (state) => state.notifications.length > 0,
    notificationCount: (state) => state.notifications.length
  },

  actions: {
    async fetchNotifications() {
      this.isLoading = true
      try {
        const userId = SessionStorage.getItem('user_id')
        if (!userId) {
          return []
        }
        const notifications = await notificationsService.getUserNotifications(userId)
        this.notifications = notifications
        return notifications
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createNotification(userId, message) {
      try {
        await notificationsService.createNotification(userId, message)
        // Refresh notifications after creation
        await this.fetchNotifications()
      } catch (error) {
        console.error('Failed to create notification:', error)
        throw error
      }
    },

    async deleteNotification(notificationId) {
      try {
        await notificationsService.deleteNotification(notificationId)
        // Remove from local state
        this.notifications = this.notifications.filter(
          (n) => n.id !== notificationId
        )
      } catch (error) {
        console.error('Failed to delete notification:', error)
        throw error
      }
    }
  }
})

