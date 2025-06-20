<script setup lang="ts">
import type { Event } from '@/types/event'

defineOptions({
  name: 'AppUiEventPriority',
})

const props = defineProps<{
  priority: Event['priority']
}>()
</script>

<template>
  <div class="flex items-end gap-2">
    <div class="flex items-end gap-[1px]">
      <div class="w-[4px] h-[3px] bg-green-500"></div>
      <div
        class="w-[4px] h-[7px] bg-gray-300 dark:bg-gray-600"
        :class="{ '!bg-yellow-500': priority > 3 }"
      ></div>
      <div
        class="w-[4px] h-[11px] bg-gray-300 dark:bg-gray-600"
        :class="{ '!bg-orange-500': priority > 5 }"
      ></div>
      <div
        class="w-[4px] h-[15px] bg-gray-300 dark:bg-gray-600"
        :class="{ '!bg-red-500': priority > 8 }"
      ></div>
    </div>
    <div class="font-semibold text-base/4">{{ props.priority }}</div>
  </div>
</template>
