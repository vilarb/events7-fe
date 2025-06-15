<script setup lang="ts">
import { useEventsStore, type Event } from '@/stores/event'
import Dialog from 'primevue/dialog'
import AppUiEventForm from '@/components/ui/eventForm.vue'
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
    eventsStore.createEventDialogOpen = false
    newEvent.value = {
      title: '',
      description: '',
      type: 'crosspromo',
      priority: 1,
    }
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

    <AppUiEventForm v-model="newEvent" />

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
  </Dialog>
</template>
