<script setup lang="ts">
import { computed } from 'vue'
import { useEvents } from '@/composables/events'
import type { Event } from '@/stores/event'

defineOptions({
  name: 'AppTableHeader',
})

const { typeFilter, fetchEvents, eventTypes } = useEvents()

const filterOptions = computed(() => {
  return [
    { value: 'all', label: 'All' },
    ...eventTypes.value.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    })),
  ]
})

const setFilter = (type: Event['type'] | 'all') => {
  typeFilter.value = type === 'all' ? null : type
  fetchEvents()
}
</script>

<template>
  <div class="flex items-center gap-2 text-xs">
    <div
      data-test-id="filter-option"
      :data-test-value="option.value"
      v-for="option in filterOptions"
      :key="option.value"
      class="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md px-2 py-1 transition-all"
      :class="{
        'dark:!bg-zinc-700 bg-zinc-200':
          option.value === 'all' ? !typeFilter : typeFilter === option.value,
      }"
      @click="setFilter(option.value)"
    >
      {{ option.label }}
    </div>
  </div>
</template>
