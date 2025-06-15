<script setup lang="ts">
import Drawer from 'primevue/drawer'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(true)

watch(visible, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      router.push('/')
    }, 150)
  }
})
</script>

<template>
  <Drawer v-model:visible="visible" position="right" :showCloseIcon="true" :closeOnEscape="true">
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Event Details</h1>
      </div>
    </template>
  </Drawer>
</template>
