import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'

export interface Event {
  id: number
  title: string
  description: string
  type: 'crosspromo' | 'liveops' | 'app' | 'ads'
  priority: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  createdAt: string
  updatedAt: string
}

interface Filter {
  type?: Event['type']
}

export const useEventsStore = defineStore('events', () => {
  const toast = useToast()

  const events = ref<Event[]>([])
  const activeEvent = ref<Event | null>(null)

  const filter = ref<Filter>({})
  const sort = ref<Record<string, string>>({ id: 'DESC' })

  const page = ref<number>(1)
  const perPage = ref<number>(25)
  const totalResults = ref<number>(0)
  const totalPages = ref<number>(0)

  const eventTypes = ref<Event['type'][]>(['crosspromo', 'liveops', 'app', 'ads'])
  const loading = ref<boolean>(false)

  /**
   * Open the create event dialog
   */
  const createEventDialogOpen = ref<boolean>(false)

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
      const options: Record<string, string> = {
        page: page.value.toString(),
        per_page: perPage.value.toString(),
      }

      if (filter.value) {
        options.s = JSON.stringify(filter.value)
      }

      if (sort.value) {
        options.sort = Object.entries(sort.value)
          .map(([key, value]) => `${key},${value}`)
          .join('&')
      }

      const params = new URLSearchParams(options)
      const response = await fetch(`http://localhost:3000/events?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }

      const eventsData = await response.json()

      events.value = eventsData.data
      totalResults.value = eventsData.total
      totalPages.value = eventsData.pageCount
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
    const response = await fetch(`http://localhost:3000/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(event),
    })

    const eventData = await response.json()
    if (!response.ok) {
      throw new Error(eventData.error)
    }

    return eventData
  }

  /**
   * Fetch an event from the database
   */
  async function fetchEvent(id: Event['id']): Promise<Event> {
    const response = await fetch(`http://localhost:3000/events/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    })

    const eventData = await response.json()
    if (!response.ok) {
      throw new Error(eventData.error)
    }

    return eventData
  }

  /**
   * Update an event in the database
   */
  async function updateEvent(event: Event): Promise<Event> {
    const response = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(event),
    })

    const eventData = await response.json()
    if (!response.ok) {
      throw new Error(eventData.error)
    }

    return eventData
  }

  /**
   * Delete an event in the database
   */
  async function deleteEvent(id: Event['id']): Promise<void> {
    const response = await fetch(`http://localhost:3000/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete event')
    }
  }

  return {
    events,
    activeEvent,
    loading,
    filter,
    sort,
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
