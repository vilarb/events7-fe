<script setup lang="ts">
import AppHeader from './components/header.vue'
import Toast from 'primevue/toast'
import AppCreateEventDialog from './components/dialogs/createEvent.vue'
import Skeleton from 'primevue/skeleton'
import { useUser } from './composables/user'

const { loading } = useUser()
</script>

<template>
  <div class="flex h-screen w-screen flex-col items-end justify-center bg-neutral-900">
    <AppHeader />

    <!-- Router views -->
    <RouterView v-if="!loading" />
    <div v-else class="flex h-[calc(100vh-56px)] w-full shrink-0 items-center justify-center">
      <Skeleton width="90%" height="90%" />
    </div>

    <!-- Dialogs -->
    <AppCreateEventDialog />

    <!-- Global toast componenet -->
    <Toast />
  </div>
</template>
