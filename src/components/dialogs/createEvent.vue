<script setup lang="ts">
import { useEventsStore, type Event } from '@/stores/event'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Slider from 'primevue/slider'
import Button from 'primevue/button'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const eventsStore = useEventsStore()
const toast = useToast()
const newEvent = ref<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>({
  title: '',
  description: '',
  type: 'crosspromo',
  priority: 1,
})

defineOptions({
  name: 'AppCreateEventDialog',
})

const createEvent = async () => {
  try {
    await eventsStore.createEvent(newEvent.value)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Event created successfully',
      life: 3000,
    })
  } catch (e) {
    console.log('error', e)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: e instanceof Error ? e.message : 'Failed to create event',
      life: 3000,
    })
  }
}
</script>

<template>
  <Dialog
    v-model:visible="eventsStore.createEventDialogOpen"
    modal
    :draggable="false"
    dismissable-mask
    style="width: 450px"
  >
    <template #header>
      <h3 class="text font-medium">Create new event</h3>
    </template>

    <div class="flex flex-col gap-4">
      <!-- TYPE SELECT -->
      <div class="flex flex-col gap-2">
        <label for="type" class="text-xs font-medium opacity-60">Type</label>
        <Select id="type" v-model="newEvent.type" :options="eventsStore.eventTypes" size="small" />
      </div>

      <!-- TITLE -->
      <div class="flex flex-col gap-2">
        <label for="title" class="text-xs font-medium opacity-60">Title</label>
        <InputText
          id="title"
          v-model="newEvent.title"
          size="small"
          placeholder="e.g. 'New campaign'"
        />
      </div>

      <!-- DESCRIPTION -->
      <div class="flex flex-col gap-2">
        <label for="description" class="text-xs font-medium opacity-60">Description</label>
        <Textarea
          id="description"
          v-model="newEvent.description"
          size="small"
          rows="3"
          placeholder="e.g. 'This is a new campaign'"
        />
      </div>

      <!-- PRIORITY -->
      <div class="flex flex-col gap-2">
        <label for="priority" class="text-xs font-medium opacity-60">Priority</label>
        <div class="grid grid-cols-6 gap-6 items-center">
          <Slider v-model="newEvent.priority" size="small" :min="1" :max="10" class="col-span-5" />
          <div class="flex items-center gap-4 col-span-1">
            <InputNumber id="priority" v-model="newEvent.priority" size="small" fluid />
          </div>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="flex justify-end gap-2 mt-6">
        <Button
          label="Cancel"
          severity="secondary"
          size="small"
          @click="eventsStore.createEventDialogOpen = false"
        />
        <Button label="Create" size="small" @click="createEvent" />
      </div>
    </div>
  </Dialog>
</template>
