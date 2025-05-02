<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <div class="centered-row">
            <img
              alt="My logo"
              src="~assets/fast_travels.png"
              style="width: 40px; height: 40px"
            >
            <span>Fast Travel App</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>
