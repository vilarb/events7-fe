<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const searchInput = ref<HTMLInputElement | null>(null)
defineOptions({
  name: 'AppHeader',
})

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      if (searchInput.value) {
        searchInput.value.select()
      } else {
        toast.add({
          severity: 'error',
          summary: 'Search',
          detail: 'Search input not found',
          life: 3000,
        })
      }
    }
  })
})
</script>

<template>
  <div class="flex w-full grow items-center px-6">
    <div class="flex items-center gap-2">
      <img src="/favicono7.png" class="h-6" />
      <h1 class="text-2xl font-semibold text-neutral-100">Events7</h1>
    </div>

    <div class="relative mx-auto w-full max-w-[600px]">
      <i
        class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
        style="font-size: 1rem"
      ></i>
      <input
        ref="searchInput"
        class="mx-auto h-9 w-full rounded-xl border border-neutral-600 bg-neutral-800 px-4 pl-10 font-normal text-white placeholder:text-neutral-500"
        placeholder="Search title/description"
      />

      <span
        class="absolute right-3 top-1/2 flex h-5 -translate-y-1/2 items-center justify-center rounded-md bg-neutral-700 px-2 text-[10px] text-neutral-200"
      >
        CTRL + K
      </span>
    </div>

    <div class="flex items-center gap-1.5">
      <div class="h-7 w-7 rounded-lg bg-blue-300 overflow-hidden">
        <!-- <UiGravatar :email="username || ''" :size="28" /> -->
      </div>
      <!-- <p class="text-xs text-neutral-200">{{ username }}</p> -->
    </div>
  </div>
</template>
