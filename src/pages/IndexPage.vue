<template>
  <q-page class="flex flex-center">
    <div class="full-width centered-column">
      <q-avatar size="200px" class="q-mb-md">
        <img alt="Fast Travel Logo" src="~assets/fast_travels.png">
      </q-avatar>
      <h4 class="text-center text-primary q-my-md">Make your travels easily! :)</h4>
    </div>

    <div class="centered-column" style="max-width: 400px; width: 100%">
      <q-input v-model="username" dense outlined label="E-mail" type="email" class="full-width"
        :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']" />
      <q-input v-model="password" type="password" dense outlined label="Password" class="full-width"
        :rules="[val => !!val || 'Password is required']" @keyup.enter="handleLogin" />
      <q-btn color="primary" label="Login" class="full-width" :loading="authStore.isLoading" @click="handleLogin" />
      <q-btn color="secondary" label="Sign Up" class="full-width" outline @click="showCreateUser = true" />
    </div>

    <q-dialog v-model="showCreateUser" @hide="resetCreateForm">
      <q-card class="full-width" style="max-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-primary">Create Account</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleCreateUser" class="q-gutter-md">
            <q-input v-model="newUsername" label="Name *" outlined dense
              :rules="[val => !!val || 'Name is required']" />
            <q-input v-model="newEmail" label="E-mail *" type="email" outlined dense
              :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']" />
            <q-input v-model="newPassword" label="Password *" type="password" outlined dense
              :rules="[val => !!val || 'Password is required', val => val.length >= 6 || 'Password must be at least 6 characters']" />
            <div class="row q-gutter-sm justify-end q-mt-md">
              <q-btn flat label="Cancel" color="negative" v-close-popup @click="resetCreateForm" />
              <q-btn type="submit" label="Submit" color="primary" :loading="authStore.isLoading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { SessionStorage, Notify, Loading } from 'quasar'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const username = ref('')
const password = ref('')
const showCreateUser = ref(false)
const newUsername = ref('')
const newEmail = ref('')
const newPassword = ref('')
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Clear session on login page
  SessionStorage.clear()
  authStore.logout()

  // Authenticate with API to get session token
  try {
    await authStore.authenticate()
  } catch (error) {
    Notify.create({
      message: 'Failed to initialize authentication',
      color: 'negative',
      position: 'top'
    })
  }
})

async function handleLogin() {
  if (!username.value || !password.value) {
    Notify.create({
      message: 'Please fill in all fields',
      color: 'negative',
      position: 'top'
    })
    return
  }

  Loading.show()
  try {
    const response = await authStore.login(username.value, password.value)
    Notify.create({
      message: response.message || 'Login successful!',
      color: 'positive',
      position: 'top'
    })
    router.push('/dashboard')
  } catch (error) {
    console.log(error);
    username.value = ''
    password.value = ''
    Notify.create({
      message: error.response?.data?.message || 'Invalid credentials',
      color: 'negative',
      position: 'top'
    })
  } finally {
    Loading.hide()
  }
}

async function handleCreateUser() {
  if (!newUsername.value || !newEmail.value || !newPassword.value) {
    Notify.create({
      message: 'Please fill in all fields',
      color: 'negative',
      position: 'top'
    })
    return
  }

  Loading.show()
  try {
    await authStore.createUser({
      name: newUsername.value,
      email: newEmail.value,
      password: newPassword.value
    })
    Notify.create({
      message: 'Account created successfully!',
      color: 'positive',
      position: 'top'
    })
    resetCreateForm()
    showCreateUser.value = false
  } catch (error) {
    Notify.create({
      message: error.response?.data?.message || 'Failed to create account',
      color: 'negative',
      position: 'top'
    })
  } finally {
    Loading.hide()
  }
}

function resetCreateForm() {
  newUsername.value = ''
  newEmail.value = ''
  newPassword.value = ''
}
</script>
