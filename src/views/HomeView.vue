<script setup lang="ts">
import { onMounted } from 'vue'
import AppTable from '@/components/table.vue'
import { useEventsStore } from '@/stores/event'
import AppCreateEventDialog from '@/components/dialogs/createEvent.vue'

const { fetchEvents } = useEventsStore()

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

    <!-- Router views for event details -->
    <RouterView />

    <!-- Dialogs -->
    <AppCreateEventDialog />
  </div>
</template>
