<script setup lang="ts">
import { useEventsStore } from './stores/event'
import { onMounted } from 'vue'
import AppHeader from './components/header.vue'
import AppTable from './components/table.vue'
import AppFilters from './components/filters.vue'

const { fetchEvents } = useEventsStore()

onMounted(async () => {
  await fetchEvents()
})
</script>

<template>
  <div class="flex h-screen w-screen flex-col items-end justify-center bg-neutral-900">
    <AppHeader />
    <div
      class="flex h-[calc(100vh-56px)] w-full shrink-0 items-center overflow-hidden rounded-t-2xl bg-zinc-200 dark:bg-zinc-800"
    >
      <main class="h-full w-full grow overflow-y-auto">
        <AppFilters />
        <AppTable />
      </main>
    </div>
  </div>
</template>
