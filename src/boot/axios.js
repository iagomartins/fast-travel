import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import api from 'src/services/api'

export default defineBoot(({ app }) => {
  // Make axios and api available globally for Options API compatibility
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
