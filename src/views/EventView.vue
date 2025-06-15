<script setup lang="ts">
/**
 * This view is used to display the details of an event.
 * It is a drawer that is opened when the user clicks on an event in the table.
 * In case the active event is not set, it will fetch the event from the database.
 * If the event is not found, it will navigate to the home view.
 */
import Drawer from 'primevue/drawer'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore, type Event } from '@/stores/event'
import AppUiEventForm from '@/components/ui/eventForm.vue'
import { useToast } from 'primevue/usetoast'
import Skeleton from 'primevue/skeleton'

const router = useRouter()
const visible = ref(true)
const currentEvent = ref<Event | null>(null)
const loading = ref(false)

const eventsStore = useEventsStore()
const toast = useToast()

/**
 * Close the drawer and navigate to the home view when the drawer is closed.
 */
const closeDrawer = () => {
  visible.value = false
  setTimeout(() => {
    eventsStore.activeEvent = null
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
      eventsStore.activeEvent = null
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
  const existingEvent = eventsStore.events.find((event) => event.id === id)
  if (existingEvent) {
    return existingEvent
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))
  return await eventsStore.fetchEvent(id)
}

/**
 * Handle error cases and show appropriate toast message
 */
const handleError = (error: unknown) => {
  console.error(error)
  closeDrawer()
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: error instanceof Error ? error.message : 'Failed to fetch event',
    life: 2000,
  })
}

/**
 * Fetch the event from the database if it is not set.
 * Set the current event to the active event.
 */
onMounted(async () => {
  if (eventsStore.activeEvent) {
    currentEvent.value = { ...eventsStore.activeEvent }
    return
  }

  try {
    loading.value = true
    const eventId = getEventId()

    if (!eventId) {
      throw new Error('No readable event ID provided')
    }

    eventsStore.activeEvent = await findOrFetchEvent(eventId)
    currentEvent.value = { ...eventsStore.activeEvent }
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :showCloseIcon="true"
    :closeOnEscape="true"
    class="!w-[400px]"
  >
    <template #header>
      <div class="flex flex-col gap-1">
        <h6 class="text-xs uppercase opacity-60 font-medium">Event details</h6>
        <h1 class="text-2xl font-bold" v-if="currentEvent">#{{ currentEvent.id }}</h1>
        <Skeleton v-else height="2rem" />
      </div>
    </template>

    <div class="flex flex-col gap-4" v-if="currentEvent">
      <AppUiEventForm v-model="currentEvent" />
    </div>
    <div v-else class="flex flex-col gap-6">
      <Skeleton height="2rem" width="100%" />
      <Skeleton height="2rem" width="100%" />
      <Skeleton height="4rem" width="100%" />
      <Skeleton height="2rem" width="100%" />
    </div>
  </Drawer>
</template>
