<template>
  <q-page class="flex flex-center">
    <div class="full-width centered-column">
      <img
      alt="My logo"
      src="~assets/fast_travels.png"
      style="width: 200px; height: 200px"
      >
      <h4 class="text-center text-primary q-my-md">Make your travels easily! :)</h4>
    </div>

    <div class="centered-column">
      <q-input style="width: 200px;" dense ref="Username" outlined label="E-mail" v-model="username"></q-input>
      <q-input style="width: 200px;" type="password" dense ref="Password" outlined label="Password" v-model="password"></q-input>
      <q-btn style="width: 200px;" color="primary" dense @click="login">Login</q-btn>
      <q-btn style="width: 200px;" color="secondary" dense @click="toggleCreateUser">Sign Up</q-btn>
    </div>
    <q-dialog v-model="createUser">
        <div class="centered-column full-width bg-white">
          <h6 class="q-ma-none text-primary">Create account:</h6>
          <q-input class="full-width" label="Name" dense outlined v-model="newUsername"></q-input>
          <q-input class="full-width" label="E-mail" dense outlined v-model="newEmail"></q-input>
          <q-input class="full-width" label="Password" dense outlined v-model="newPassword"></q-input>
          <q-btn class="q-px-md" color="primary" dense label="Submit" @click="createNewUser()"></q-btn>
          <q-btn class="q-px-md" color="negative" dense label="Cancel" @click="toggleCreateUser()"></q-btn>
        </div>
      </q-dialog>
  </q-page>
</template>

<script setup>
  import { SessionStorage, Notify, Loading } from 'quasar'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'

  const username = ref('')
  const password = ref('')
  const createUser = ref(false)
  const newUsername = ref('')
  const newEmail = ref('')
  const newPassword = ref('')
  const router = useRouter()

  SessionStorage.clear()

  //Get API token
  const api_url = `${process.env.API_URL}/api/authenticate`
  const body = {
    email: process.env.API_USER,
    password: process.env.API_PASSWORD
  }
  axios.post(api_url, body).then(({ data }) => {
    SessionStorage.set('session_key', data);
  })

  async function login() {
    Loading.show()
    SessionStorage.set('user', username.value);

    const user = {
      type: 'adm'
    }

    if (username === '' || password === '') {
      loginError()
      Loading.hide()
      return
    }

    const login_url = `${process.env.API_URL}/api/v1/userLogin`
    const login_body = {
      email: username.value,
      password: password.value
    }
    const config = {
      headers: {
        Authorization: `Bearer ${SessionStorage.getItem('session_key')}`
      }
    }

    const response = await axios.post(login_url, login_body, config).then(({ data }) => {
      SessionStorage.set('user_id', data.user.id);
      user.type = data.user.id === 1 ? 'adm' : 'user'
      SessionStorage.set('user_type', user.type)
      router.push('/dashboard')
    }).catch(() => {
      username.value = ''
      password.value = ''
      Loading.hide()
      loginError()
    })
  }

  function loginError() {
    Notify.create({
      message: 'Invalid credentials',
      color: 'red',
      position: 'top-right'
    })
  }

  function createNewUser() {
    if (newUsername.value === '' || newEmail.value === '' || newPassword.value === '') {
      Notify.create({
        message: 'Incomplete form',
        color: 'negative',
        position: 'top-right'
      })
      return
    }
    Loading.show()

    const create_api_url = `${process.env.API_URL}/api/v1/users`
    const create_body = {
      name: newUsername.value,
      email: newEmail.value,
      password: newPassword.value
    }
    const config = {
      headers: {
        Authorization: `Bearer ${SessionStorage.getItem('session_key')}`
      }
    }

    axios.post(create_api_url, create_body, config).then(({ data }) => {
      Loading.hide()
      newUsername.value = ''
      newEmail.value = ''
      newPassword.value = ''
      toggleCreateUser()
      Notify.create({
        message: 'Account created',
        color: 'secondary',
        position: 'top-right'
      })
    })
  }

  function toggleCreateUser() {
    createUser.value = !createUser.value
  }
</script>
