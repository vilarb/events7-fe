<script setup lang="ts">
import { computed } from 'vue'
import { useEvents } from '@/composables/events'
import type { Event } from '@/types/event'

defineOptions({
  name: 'AppTableHeader',
})

const { typeFilter, fetchEvents, eventTypes } = useEvents()

/**
 * Compute the filter options
 * @returns {Array<{value: string, label: string}>} The filter options
 */
const filterOptions = computed(() => {
  return [
    { value: 'all' as const, label: 'All' },
    ...eventTypes.value.map((type) => ({
      value: type as Event['type'],
      label: type.charAt(0).toUpperCase() + type.slice(1),
    })),
  ]
})

/**
 * Set the filter type and fetch the new events
 * @param type - The type to filter by
 */
const setFilter = (type: Event['type'] | 'all') => {
  typeFilter.value = type === 'all' ? null : type
  fetchEvents()
}
</script>

<template>
  <div class="flex items-center gap-2 text-xs">
    <!-- Filter options -->
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
