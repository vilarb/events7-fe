<script setup lang="ts">
import type { Event } from '@/stores/event'
import { useEventsStore } from '@/stores/event'
import { defineModel } from 'vue'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Slider from 'primevue/slider'
import InputNumber from 'primevue/inputnumber'

defineOptions({
  name: 'AppUiEventForm',
})

const event = defineModel<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>({
  default: () => ({
    title: '',
    description: '',
    type: 'app',
    priority: 1,
  }),
})

const eventsStore = useEventsStore()
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- TYPE SELECT -->
    <div class="flex flex-col gap-2">
      <label for="type" class="text-xs font-medium opacity-60">Type</label>
      <Select id="type" v-model="event.type" :options="eventsStore.eventTypes" size="small" />
    </div>

    <!-- TITLE -->
    <div class="flex flex-col gap-2">
      <label for="title" class="text-xs font-medium opacity-60">Title</label>
      <InputText id="title" v-model="event.title" size="small" placeholder="e.g. 'New campaign'" />
    </div>

    <!-- DESCRIPTION -->
    <div class="flex flex-col gap-2">
      <label for="description" class="text-xs font-medium opacity-60">Description</label>
      <Textarea
        id="description"
        v-model="event.description"
        size="small"
        rows="3"
        placeholder="e.g. 'This is a new campaign'"
      />
    </div>

    <!-- PRIORITY -->
    <div class="flex flex-col gap-2">
      <label for="priority" class="text-xs font-medium opacity-60">Priority</label>
      <div class="grid grid-cols-6 gap-6 items-center">
        <Slider v-model="event.priority" size="small" :min="1" :max="10" class="col-span-5" />
        <div class="flex items-center gap-4 col-span-1">
          <InputNumber id="priority" v-model="event.priority" size="small" fluid />
        </div>
      </div>
    </div>
  </div>
</template>
