<script setup lang="ts">
import { useEventsStore } from './stores/event'
import { onMounted } from 'vue'
import AppHeader from './components/header.vue'
import Toast from 'primevue/toast'
import AppCreateEventDialog from './components/dialogs/createEvent.vue'

const { fetchEvents } = useEventsStore()

onMounted(async () => {
  await fetchEvents()
})
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
