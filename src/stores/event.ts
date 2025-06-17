import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useApiFetch } from '@/composables/baseApi'

export interface Event {
  id: number
  title: string
  description: string
  type: 'crosspromo' | 'liveops' | 'app' | 'ads'
  priority: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  createdAt: string
  updatedAt: string
}

export const useEventsStore = defineStore('events', () => {
  const toast = useToast()

  const events = ref<Event[]>([])
  const activeEvent = ref<Event | null>(null)
  const abortController = new AbortController()

  const search = ref<string>('')
  const typeFilter = ref<Event['type'] | null>(null)
  const orderDirection = ref<string>('DESC')
  const orderBy = ref<string>('id')

  const page = ref<number>(1)
  const perPage = ref<number>(25)
  const totalResults = ref<number>(0)
  const totalPages = ref<number>(0)

  const eventTypes = ref<Event['type'][]>(['crosspromo', 'liveops', 'app', 'ads'])
  const loading = ref<boolean>(false)
  const debounceTimeout = ref<number | null>(null)

  /**
   * Open the create event dialog
   */
  const createEventDialogOpen = ref<boolean>(false)

  /**
   * Debounce the search function to prevent request spamming and backend load
   */
  const debouncedSearch = () => {
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value)
    }
    debounceTimeout.value = setTimeout(() => {
      page.value = 1
      fetchEvents()
    }, 150)
  }

  watch(search, () => {
    debouncedSearch()
  })

  /**
   * Fetch events from the API and construct the filter options and pagination query params
   *
   * !This is the only function in this state that automatically try catches the error as it is used manytimes throughout the app.
   * !This is to avoid repeating the same code over and over again.
   *
   * @returns {Promise<void>}
   */
  async function fetchEvents() {
    try {
      loading.value = true

      const params: Record<string, string> = {
        page: page.value.toString(),
        perPage: perPage.value.toString(),
        orderDirection: orderDirection.value,
        orderBy: orderBy.value,
      }

      if (typeFilter.value) {
        params.type = typeFilter.value
      }

      if (search.value) {
        params.search = search.value
      }

      const paramsString = new URLSearchParams(params)

      const eventsData = await useApiFetch(`/events?${paramsString}`, {
        signal: abortController.signal,
      })

      events.value = eventsData.events
      totalResults.value = eventsData.total
      totalPages.value = Math.ceil(eventsData.total / perPage.value)
    } catch (e) {
      console.error(e)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: e instanceof Error ? e.message : 'Failed to fetch events',
        life: 3000,
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new event in the database
   */
  async function createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    return await useApiFetch(`/events`, {
      method: 'POST',
      body: JSON.stringify(event),
    })
  }

  /**
   * Fetch an event from the database
   */
  async function fetchEvent(id: Event['id']): Promise<Event> {
    return await useApiFetch(`/events/${id}`)
  }

  /**
   * Update an event in the database
   */
  async function updateEvent(event: Event): Promise<Event> {
    return await useApiFetch(`/events/${event.id}`, {
      method: 'PATCH',
      body: JSON.stringify(event),
    })
  }

  /**
   * Delete an event in the database
   */
  async function deleteEvent(id: Event['id']): Promise<void> {
    return await useApiFetch(`/events/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    events,
    activeEvent,
    loading,
    typeFilter,
    search,
    orderDirection,
    orderBy,
    pagination: { page, perPage, totalResults, totalPages },

    createEventDialogOpen,
    eventTypes,

    fetchEvents,
    createEvent,
    fetchEvent,
    updateEvent,
    deleteEvent,
  }
})
