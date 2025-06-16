<script setup lang="ts">
import AppHeader from './components/header.vue'
import Toast from 'primevue/toast'
import AppCreateEventDialog from './components/dialogs/createEvent.vue'
</script>

<template>
  <div class="flex h-screen w-screen flex-col items-end justify-center bg-neutral-900">
    <AppHeader />

    <!-- Router views for event details -->
    <RouterView />

    <!-- Dialogs -->
    <AppCreateEventDialog />

    <!-- Global toast componenet -->
    <Toast />
  </div>
</template>
