import { defineStore, acceptHMRUpdate } from 'pinia'

export const useUser = defineStore('user', {
  state: () => ({
    user: null
  }),
  getters: {
    getUser: (state) => state.user
  },
  actions: {
    setUser(user) {
      this.user = user
    },
    clearUser() {
      this.user = null
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
