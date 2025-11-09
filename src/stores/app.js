import { defineStore } from 'pinia'
import { Dark } from 'quasar'

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: localStorage.getItem('darkMode') === 'true' || false
  }),

  getters: {
    isDarkMode: (state) => state.darkMode
  },

  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      Dark.set(this.darkMode)
      localStorage.setItem('darkMode', this.darkMode.toString())
    },

    setDarkMode(value) {
      this.darkMode = value
      Dark.set(this.darkMode)
      localStorage.setItem('darkMode', this.darkMode.toString())
    },

    initDarkMode() {
      Dark.set(this.darkMode)
    }
  }
})

