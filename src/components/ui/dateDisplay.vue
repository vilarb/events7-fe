<script setup lang="ts">
defineOptions({
  name: 'AppUiDateDisplay',
})

const props = defineProps<{
  date: string
}>()
</script>

<template>
  <div>
    {{
      new Date(props.date).toLocaleString('en-US', {
        timeStyle: 'short',
        dateStyle: 'medium',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    }}
  </div>
</template>
