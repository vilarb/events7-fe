import { computed, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useApiFetch } from '@/composables/baseApi'
import type { Event } from '@/types/event'

// Events state
const events = ref<Event[]>([])
// EventView route active event state
const activeEvent = ref<Event | null>(null)

// Events list filtering states
const search = ref<string>('')
const typeFilter = ref<Event['type'] | null>(null)
const orderDirection = ref<string>('DESC')
const orderBy = ref<string>('id')

// Events list pagination states
const page = ref<number>(1)
const perPage = ref<number>(25)
const totalResults = ref<number>(0)
const totalPages = ref<number>(0)

// Events list types
const eventTypes = ref<Event['type'][]>(['crosspromo', 'liveops', 'app', 'ads'])

// Events list loading state
const loading = ref<boolean>(false)

// Events list debounce timeout
const debounceTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// Events list abort controller
const abortController = new AbortController()

// Events list create event dialog open state
const createEventDialogOpen = ref<boolean>(false)

/**
 * Events composable used for state management and fetching events
 *
 * @property {Event[]} events - The list of events
 * @property {Event | null} activeEvent - EventView route active event state
 * @property {boolean} loading - Events list loading state
 * @property {Event['type'] | null} typeFilter - The type filter
 * @property {string} search - Events list search query
 * @property {string} orderDirection - Events list order direction
 * @property {string} orderBy - Events list order by
 * @property {Object} pagination - The pagination object
 * @property {boolean} createEventDialogOpen - The create event dialog open state
 * @property {Event['type'][]} eventTypes - The list of event types
 * @property {Function} fetchEvents - The function to fetch events
 *
 * @returns {Object} Events composable
 */
export const useEvents = () => {
  const toast = useToast()

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

  /**
   * Watch the search query and debounce the search function
   */
  watch(search, () => {
    debouncedSearch()
  })

  /**
   * Fetch events from the API and construct the filter options and pagination query params
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

  return {
    events: computed(() => events.value),
    activeEvent: computed({
      get: () => activeEvent.value,
      set: (value) => {
        activeEvent.value = value
      },
    }),
    loading: computed(() => loading.value),
    typeFilter: computed({
      get: () => typeFilter.value,
      set: (value) => {
        typeFilter.value = value
      },
    }),
    search: computed({
      get: () => search.value,
      set: (value) => {
        search.value = value
      },
    }),
    orderDirection: computed({
      get: () => orderDirection.value,
      set: (value) => {
        orderDirection.value = value
      },
    }),
    orderBy: computed({
      get: () => orderBy.value,
      set: (value) => {
        orderBy.value = value
      },
    }),
    pagination: {
      page: computed({
        get: () => page.value,
        set: (value) => {
          page.value = value
        },
      }),
      perPage: computed({
        get: () => perPage.value,
        set: (value) => {
          perPage.value = value
        },
      }),
      totalResults: computed(() => totalResults.value),
      totalPages: computed(() => totalPages.value),
    },
    createEventDialogOpen: computed({
      get: () => createEventDialogOpen.value,
      set: (value) => {
        createEventDialogOpen.value = value
      },
    }),
    eventTypes,
    fetchEvents,
  }
}
