<script setup lang="ts">
import AppTable from '@/components/table.vue'
</script>

<template>
  <div
    class="flex h-[calc(100vh-56px)] w-full shrink-0 items-center overflow-hidden rounded-t-2xl bg-zinc-200 dark:bg-zinc-800"
  >
    <main class="h-full w-full grow overflow-y-auto">
      <AppTable />
    </main>

    <RouterView />
  </div>
</template>
