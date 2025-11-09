import { defineStore } from 'pinia'
import { SessionStorage } from 'quasar'
import * as ordersService from 'src/services/ordersService'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    allOrders: [],
    userOrders: [],
    isLoading: false,
    filters: {
      destination: '',
      startDate: '',
      endDate: ''
    }
  }),

  getters: {
    filteredOrders: (state) => state.allOrders
  },

  actions: {
    async fetchAllOrders() {
      this.isLoading = true
      try {
        const orders = await ordersService.getAllOrders()
        this.allOrders = orders
        return orders
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchUserOrders() {
      this.isLoading = true
      try {
        const userId = SessionStorage.getItem('user_id')
        if (!userId) {
          throw new Error('User ID not found')
        }
        const orders = await ordersService.getOrdersByUser(userId)
        this.userOrders = orders
        return orders
      } catch (error) {
        console.error('Failed to fetch user orders:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createOrder(orderData) {
      this.isLoading = true
      try {
        const newOrder = await ordersService.createOrder(orderData)
        // Refresh user orders after creation
        await this.fetchUserOrders()
        return newOrder
      } catch (error) {
        console.error('Failed to create order:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateOrder(orderId, orderData) {
      this.isLoading = true
      try {
        const updatedOrder = await ordersService.updateOrder(orderId, orderData)
        // Refresh orders after update
        await this.fetchAllOrders()
        await this.fetchUserOrders()
        return updatedOrder
      } catch (error) {
        console.error('Failed to update order:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async filterOrders(filters) {
      this.isLoading = true
      this.filters = { ...filters }
      try {
        const filtered = await ordersService.filterOrders(filters)
        this.allOrders = filtered
        return filtered
      } catch (error) {
        console.error('Failed to filter orders:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    clearFilters() {
      this.filters = {
        destination: '',
        startDate: '',
        endDate: ''
      }
      this.fetchAllOrders()
      this.fetchUserOrders()
    }
  }
})

