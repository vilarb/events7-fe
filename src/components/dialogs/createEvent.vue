<script setup lang="ts">
import { useEvents } from '@/composables/events'
import type { Event } from '@/types/event'
import Dialog from 'primevue/dialog'
import AppUiEventForm from '@/components/ui/eventForm.vue'
import Button from 'primevue/button'
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useEventApi } from '@/composables/api/event'
import { useUser } from '@/composables/user'

const { createEventDialogOpen, fetchEvents } = useEvents()
const { createEvent: createEventApi } = useEventApi()
const { user } = useUser()
const toast = useToast()
const newEvent = ref<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>({
  title: '',
  description: '',
  type: 'crosspromo',
  priority: 1,
})
const loading = ref<boolean>(false)

const invalidAdsType = computed(() => {
  return !user.value.adsAuthorized && newEvent.value.type === 'ads'
})

defineOptions({
  name: 'AppCreateEventDialog',
})

/**
 * Call the createEvent function from the events store to create a new event and fetch events.
 * Close the dialog, reset the form and show a success toast.
 * If there is an error, show an error toast.
 */
const createEvent = async () => {
  try {
    loading.value = true
    await createEventApi(newEvent.value)
    await fetchEvents()
    createEventDialogOpen.value = false
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
  } finally {
    loading.value = false
  }
}

defineExpose({
  newEvent,
})
</script>

<template>
  <Dialog
    v-model:visible="createEventDialogOpen"
    modal
    :draggable="false"
    dismissable-mask
    style="width: 450px"
    data-test-id="create-event-dialog"
  >
    <!-- HEADER -->
    <template #header>
      <h3 class="text-lg font-medium">Create new event</h3>
    </template>

    <!-- FORM -->
    <AppUiEventForm v-model="newEvent" :invalidAdsType="invalidAdsType" />

    <!-- CALL TO ACTION BUTTONS -->
    <div class="flex justify-end gap-2 mt-6">
      <Button
        label="Cancel"
        severity="secondary"
        size="small"
        @click="createEventDialogOpen = false"
      />
      <Button
        data-test-id="createButton"
        label="Create"
        size="small"
        @click="createEvent"
        :loading="loading"
        :disabled="invalidAdsType || loading"
      />
    </div>
  </Dialog>
</template>
