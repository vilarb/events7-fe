<script setup lang="ts">
import type { Event } from '@/types/event'
import { computed } from 'vue'

defineOptions({
  name: 'AppUiEventType',
})

const props = defineProps<{
  type: Event['type']
}>()

const typeColor = computed(() => {
  switch (props.type) {
    case 'crosspromo':
      return 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
    case 'liveops':
      return 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
    case 'app':
      return 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
    case 'ads':
      return 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
    default:
      return 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
  }
})
</script>

<template>
  <div
    class="flex items-center justify-center rounded-xl px-2 py-1 text-xs uppercase"
    :class="typeColor"
  >
    {{ type }}
  </div>
</template>
