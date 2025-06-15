import { ref } from 'vue'
import { defineStore } from 'pinia'

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
  const events = ref<Event[]>([])

  const filter = ref<Filter>({})

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

      const params = new URLSearchParams(options)
      const response = await fetch(`http://localhost:3000/events?${params}`)
      const eventsData = await response.json()
      events.value = eventsData.data
      totalResults.value = eventsData.total
      totalPages.value = eventsData.pageCount
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new event
   */
  async function createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) {
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

    fetchEvents()
  }

  return {
    events,
    loading,
    filter,
    pagination: { page, perPage, totalResults, totalPages },

    createEventDialogOpen,
    eventTypes,

    fetchEvents,
    createEvent,
  }
})
