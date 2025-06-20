<script setup lang="ts">
import { onMounted } from 'vue'
import AppTable from '@/components/table.vue'
import AppCreateEventDialog from '@/components/dialogs/createEvent.vue'
import { useEvents } from '@/composables/events'

const { fetchEvents } = useEvents()

/**
 * Initial fetch of events on route mount
 */
onMounted(async () => {
  await fetchEvents()
})
</script>

<template>
  <div
    class="flex h-[calc(100vh-56px)] w-full shrink-0 items-center overflow-hidden rounded-t-2xl bg-zinc-200 dark:bg-zinc-800"
  >
    <main class="h-full w-full grow overflow-y-auto">
      <AppTable />
    </main>

    <!-- Router views for child routes (event details) -->
    <RouterView />

    <!-- Dialogs -->
    <AppCreateEventDialog />
  </div>
</template>
