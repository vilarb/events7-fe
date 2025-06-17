<script setup lang="ts">
import { useEventsStore, type Event } from '@/stores/event'
import Dialog from 'primevue/dialog'
import AppUiEventForm from '@/components/ui/eventForm.vue'
import Button from 'primevue/button'
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useEventApi } from '@/composables/api/event'

const eventsStore = useEventsStore()
const { createEvent: createEventApi } = useEventApi()
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

const validateUser = async () => {
  const response = await fetch('https://api.ipify.org?format=json')
  const data = await response.json()
  console.log(data)

  const response2 = await fetch(`http://localhost:3000/users/authorize?ip=${data.ip}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  })
  console.log(response2)

  console.log(await response2.json())
}

onMounted(() => {
  validateUser()
})

/**
 * Call the createEvent function from the events store to create a new event and fetch events.
 * Close the dialog, reset the form and show a success toast.
 * If there is an error, show an error toast.
 */
const createEvent = async () => {
  try {
    await createEventApi(newEvent.value)
    await eventsStore.fetchEvents()
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
    <!-- HEADER -->
    <template #header>
      <h3 class="text-lg font-medium">Create new event</h3>
    </template>

    <!-- FORM -->
    <AppUiEventForm v-model="newEvent" />

    <!-- CALL TO ACTION BUTTONS -->
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
