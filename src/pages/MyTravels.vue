<template>
  <q-page class="flex flex-center">
    <div class="full-width">
      <h5 class="text-left">My travels:</h5>
    </div>

    <div class="full-width right-column"><q-btn dense label="Schedule travel" color="primary"></q-btn></div>
    <div class="centered-column">
      <q-table dense></q-table>
    </div>
  </q-page>
</template>

<script setup>
  import { LocalStorage, SessionStorage } from 'quasar'
  import { ref } from 'vue'

  const username = ref('')
  const password = ref('')

  function login() {
    SessionStorage.set('user', username.value);
  }
</script>
