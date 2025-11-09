<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn v-if="showDrawer" flat dense round icon="menu" aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen" class="q-mr-sm" />

        <q-avatar class="q-mr-sm">
          <img src="~assets/fast_travels.png" alt="Fast Travel Logo">
        </q-avatar>

        <q-toolbar-title class="text-weight-bold">
          Fast Travel
        </q-toolbar-title>

        <q-space />

        <q-btn flat dense round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode"
          class="q-mr-xs">
          <q-tooltip>Toggle Dark Mode</q-tooltip>
        </q-btn>

        <q-btn v-if="isAuthenticated" flat dense round icon="account_circle" class="q-mr-xs">
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="account_circle" size="md" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ userEmail }}</q-item-label>
                  <q-item-label caption>{{ userType === 'adm' ? 'Administrator' : 'User' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="showDrawer" v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          Navigation
        </q-item-label>

        <q-item clickable v-ripple :to="{ name: 'dashboard' }" exact active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SessionStorage } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useAppStore } from 'src/stores/app'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const leftDrawerOpen = ref(false)

const isAuthenticated = computed(() => {
  return authStore.isAuthenticated || !!SessionStorage.getItem('user_id')
})

const isAdmin = computed(() => {
  return authStore.isAdmin || SessionStorage.getItem('user_type') === 'adm'
})

const userEmail = computed(() => {
  return authStore.user?.email || SessionStorage.getItem('user') || 'User'
})

const userType = computed(() => {
  return authStore.userType || SessionStorage.getItem('user_type') || 'user'
})

const showDrawer = computed(() => {
  return isAuthenticated.value && route.path !== '/'
})

function toggleDarkMode() {
  appStore.toggleDarkMode()
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  appStore.initDarkMode()
  authStore.initAuth()
})
</script>

<style scoped>
.q-toolbar {
  min-height: 64px;
}
</style>
