<script setup lang="ts">
/**
 * This view is used to display the details of an event.
 * It is a drawer that is opened when the user clicks on an event in the table.
 * In case the active event is not set, it will fetch the event from the database.
 * If the event is not found, it will navigate to the home view.
 */
import Drawer from 'primevue/drawer'
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Event } from '@/types/event'
import { useEvents } from '@/composables/events'
import AppUiEventForm from '@/components/ui/eventForm.vue'
import { useToast } from 'primevue/usetoast'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import AppUiConfirmPopup from '@/components/dialogs/confirmPopup.vue'
import { useEventApi } from '@/composables/api/event'
import { useUser } from '@/composables/user'

const router = useRouter()
const visible = ref(true)
const currentEvent = ref<Event | null>(null)
const loadingPage = ref(false)
const loading = ref(false)
const deleteEventPopupVisible = ref(false)

const { activeEvent, fetchEvents, events } = useEvents()
const {
  fetchEvent: fetchEventApi,
  updateEvent: updateEventApi,
  deleteEvent: deleteEventApi,
} = useEventApi()
const { user } = useUser()
const toast = useToast()

const invalidAdsType = computed(() => {
  return !user.value.adsAuthorized && currentEvent.value?.type === 'ads'
})

/**
 * Close the drawer and navigate to the home view when the drawer is closed.
 */
const closeDrawer = () => {
  visible.value = false
  setTimeout(() => {
    activeEvent.value = null
    currentEvent.value = null
    router.push('/')
  }, 150)
}

/**
 * Close the drawer and navigate to the home view when the drawer is closed.
 */
watch(visible, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      activeEvent.value = null
      currentEvent.value = null
      router.push('/')
    }, 150)
  }
})

/**
 * Get the event ID from the route params
 */
const getEventId = (): number | null => {
  const id = router.currentRoute.value.params.id
  if (typeof id === 'string' && !isNaN(parseInt(id))) {
    return parseInt(id)
  }
  return null
}

/**
 * Find event in the store or fetch it from the API
 */
const findOrFetchEvent = async (id: number): Promise<Event> => {
  const existingEvent = events.value.find((event) => event.id === id)
  if (existingEvent) {
    return existingEvent
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))
  return await fetchEventApi(id)
}

/**
 * Handle error cases and show appropriate toast message
 */
const handleError = (error: unknown) => {
  console.error(error)
  closeDrawer()
  displayToast('error', 'Error', error instanceof Error ? error.message : 'Failed to fetch event')
}

/**
 * Fetch the event from the database if it is not set.
 * Set the current event to the active event.
 */
onMounted(async () => {
  if (activeEvent.value) {
    currentEvent.value = { ...activeEvent.value }
    return
  }

  try {
    loadingPage.value = true
    const eventId = getEventId()

    if (!eventId) {
      throw new Error('No readable event ID provided')
    }

    activeEvent.value = await findOrFetchEvent(eventId)
    currentEvent.value = { ...activeEvent.value }
  } catch (error) {
    handleError(error)
  } finally {
    loadingPage.value = false
  }
})

const displayToast = (severity: string, summary: string, detail: string) => {
  toast.add({
    severity,
    summary,
    detail,
    life: 2000,
  })
}

/**
 * Save the event to the database.
 * Fetch the events from the database and close the drawer.
 */
const saveEvent = async () => {
  try {
    loading.value = true
    if (!currentEvent.value) {
      throw new Error('No event to save')
    }

    await updateEventApi(currentEvent.value)
    await fetchEvents()
    deleteEventPopupVisible.value = false
    closeDrawer()
    displayToast('success', 'Success', 'Event saved successfully')
  } catch (error) {
    displayToast('error', 'Error', error instanceof Error ? error.message : 'Failed to save event')
  } finally {
    loading.value = false
  }
}

/**
 * Delete the event from the database.
 * Fetch the events from the database and close the drawer.
 */
const deleteEvent = async () => {
  try {
    loading.value = true
    if (!currentEvent.value) {
      throw new Error('No event to save')
    }

    await deleteEventApi(currentEvent.value.id)
    await fetchEvents()
    closeDrawer()
    displayToast('success', 'Success', 'Event deleted successfully')
  } catch (error) {
    console.error(error)
    displayToast('error', 'Error', error instanceof Error ? error.message : 'Failed to save event')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :showCloseIcon="true"
    :closeOnEscape="true"
    class="!w-[500px]"
  >
    <template #header>
      <div class="flex flex-col gap-1">
        <h6 class="text-xs uppercase opacity-60 font-medium">
          Event details #{{ currentEvent?.id }}
        </h6>
        <h1 class="text-2xl font-bold" v-if="currentEvent">{{ currentEvent?.title }}</h1>
        <Skeleton v-else height="2rem" />
      </div>
    </template>

    <div class="flex flex-col gap-4 h-full" v-if="currentEvent">
      <AppUiEventForm v-model="currentEvent" :invalidAdsType="invalidAdsType" />

      <div class="flex justify-end gap-2">
        <Button label="Close" @click="closeDrawer" severity="secondary" size="small" />
        <Button label="Update event" @click="saveEvent" size="small" :loading="loading" />
      </div>

      <div
        class="flex justify-between border items-center border-red-600 rounded-md p-4 gap-4 mt-auto relative"
      >
        <div
          class="absolute -top-2 left-0 text-xs uppercase font-medium bg-white dark:bg-zinc-900 text-red-600 px-1 ml-3"
        >
          Danger zone
        </div>
        <div class="flex flex-col gap-1 min-w-0 flex-1 mr-4">
          <h6 class="text-xs uppercase font-medium">Delete event</h6>
          <p class="text-xs opacity-60">
            Deleting an event will remove it from the database permanently and cannot be undone.
          </p>
        </div>
        <div class="flex-shrink-0">
          <Button
            data-test-id="delete-event-button"
            label="Delete event"
            icon="pi pi-trash"
            @click="deleteEventPopupVisible = true"
            size="small"
            severity="danger"
            outlined
            :disabled="loading"
          />
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-6">
      <Skeleton height="2rem" width="100%" />
      <Skeleton height="2rem" width="100%" />
      <Skeleton height="4rem" width="100%" />
      <Skeleton height="2rem" width="100%" />
    </div>

    <AppUiConfirmPopup
      v-model:visible="deleteEventPopupVisible"
      title="Delete event"
      message="Are you sure you want to delete this event? This is a permanent action and cannot be undone."
      confirmLabel="Delete"
      confirmSeverity="danger"
      @confirm="deleteEvent"
      :loading="loading"
      :disabled="invalidAdsType"
    />
  </Drawer>
</template>
