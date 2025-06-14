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

  const loading = ref<boolean>(false)

  /**
   * Fetch events from the API and construct the filter options and pagination query params
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

  return {
    events,
    loading,
    filter,
    pagination: { page, perPage, totalResults, totalPages },

    fetchEvents,
  }
})
