<template>
  <q-page class="flex flex-center">
    <div class="full-width centered-column">
      <h3 class="text-center">Login and Start Flying Up!</h3>
      <img
        alt="My logo"
        src="~assets/fast_travels.png"
        style="width: 200px; height: 200px"
      >
    </div>

    <div class="centered-column">
      <q-input dense ref="Username" outlined label="Username" v-model="username"></q-input>
      <q-input dense ref="Password" outlined label="Password" v-model="password"></q-input>
      <q-btn class="full-width" color="primary" dense @click="() => { login() ? this.$router.push('/dashboard') : loginError() }">Login</q-btn>
    </div>
  </q-page>
</template>

<script setup>
  import { LocalStorage, SessionStorage, Notify } from 'quasar'
  import { ref } from 'vue'
  import router from 'src/router'

  const username = ref('')
  const password = ref('')

  function login() {
    SessionStorage.set('user', username.value);

    return true;
  }

  function loginError() {
    Notify.create({
      message: 'Invalid credentials',
      color: 'red',
      position: 'top-right'
    })
  }
</script>
