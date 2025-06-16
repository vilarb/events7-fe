<script setup lang="ts">
import { useEventsStore } from '@/stores/event'
import type { Event } from '@/stores/event'
import { computed } from 'vue'

defineOptions({
  name: 'AppTableHeader',
})

const eventsStore = useEventsStore()
const filter = computed(() => eventsStore.typeFilter)

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'crosspromo', label: 'Crosspromo' },
  { value: 'liveops', label: 'Liveops' },
  { value: 'app', label: 'App' },
  { value: 'ads', label: 'Ads' },
] as const

const setFilter = (type: Event['type'] | 'all') => {
  eventsStore.typeFilter = type === 'all' ? null : type
  eventsStore.fetchEvents()
}
</script>

<template>
  <div class="flex items-center gap-2 text-xs">
    <div
      v-for="option in filterOptions"
      :key="option.value"
      class="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md px-2 py-1 transition-all"
      :class="{
        'dark:!bg-zinc-700 bg-zinc-200': option.value === 'all' ? !filter : filter === option.value,
      }"
      @click="setFilter(option.value)"
    >
      {{ option.label }}
    </div>
  </div>
</template>
