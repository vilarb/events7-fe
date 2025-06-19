import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useEvents } from '../events'
import type { Event } from '@/types/event'

// Mock the baseApi composable
vi.mock('../baseApi', () => ({
  useApiFetch: vi.fn(),
}))

// Mock the PrimeVue toast
const mockToastAdd = vi.fn()
vi.mock('primevue/usetoast', () => ({
  useToast: vi.fn(() => ({
    add: mockToastAdd,
  })),
}))

describe('useEvents', () => {
  let eventsComposable: ReturnType<typeof useEvents>
  let mockUseApiFetch: ReturnType<typeof vi.fn>

  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Test Event 1',
      description: 'Test Description 1',
      type: 'crosspromo',
      priority: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Event 2',
      description: 'Test Description 2',
      type: 'liveops',
      priority: 3,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
  ]

  beforeEach(async () => {
    vi.clearAllMocks()

    // Setup mocks
    const { useApiFetch } = await import('../baseApi')
    mockUseApiFetch = vi.mocked(useApiFetch)

    eventsComposable = useEvents()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should provide event types', () => {
      expect(eventsComposable.eventTypes.value).toEqual(['crosspromo', 'liveops', 'app', 'ads'])
    })
  })

  describe('fetchEvents', () => {
    it('should fetch events successfully with default parameters', async () => {
      const mockResponse = {
        events: mockEvents,
        total: 2,
      }
      mockUseApiFetch.mockResolvedValueOnce(mockResponse)

      // Reset state to defaults for this test
      eventsComposable.typeFilter.value = null
      eventsComposable.search.value = ''
      eventsComposable.orderDirection.value = 'DESC'
      eventsComposable.orderBy.value = 'id'
      eventsComposable.pagination.page.value = 1
      eventsComposable.pagination.perPage.value = 25

      await eventsComposable.fetchEvents()

      expect(mockUseApiFetch).toHaveBeenCalledWith(
        '/events?page=1&perPage=25&orderDirection=DESC&orderBy=id',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      )
      expect(eventsComposable.events.value).toEqual(mockEvents)
      expect(eventsComposable.pagination.totalResults.value).toBe(2)
      expect(eventsComposable.pagination.totalPages.value).toBe(1)
      expect(eventsComposable.loading.value).toBe(false)
    })

    it('should fetch events with type filter', async () => {
      const mockResponse = {
        events: [mockEvents[0]],
        total: 1,
      }
      mockUseApiFetch.mockResolvedValueOnce(mockResponse)

      // Reset state and set type filter
      eventsComposable.typeFilter.value = 'crosspromo'
      eventsComposable.search.value = ''
      eventsComposable.orderDirection.value = 'DESC'
      eventsComposable.orderBy.value = 'id'
      eventsComposable.pagination.page.value = 1
      eventsComposable.pagination.perPage.value = 25

      await eventsComposable.fetchEvents()

      expect(mockUseApiFetch).toHaveBeenCalledWith(
        '/events?page=1&perPage=25&orderDirection=DESC&orderBy=id&type=crosspromo',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      )
    })

    it('should fetch events with search query', async () => {
      const mockResponse = {
        events: [mockEvents[0]],
        total: 1,
      }
      mockUseApiFetch.mockResolvedValueOnce(mockResponse)

      // Reset state and set search
      eventsComposable.typeFilter.value = null
      eventsComposable.search.value = 'test'
      eventsComposable.orderDirection.value = 'DESC'
      eventsComposable.orderBy.value = 'id'
      eventsComposable.pagination.page.value = 1
      eventsComposable.pagination.perPage.value = 25

      await eventsComposable.fetchEvents()

      expect(mockUseApiFetch).toHaveBeenCalledWith(
        '/events?page=1&perPage=25&orderDirection=DESC&orderBy=id&search=test',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      )
    })

    it('should fetch events with custom pagination', async () => {
      const mockResponse = {
        events: mockEvents,
        total: 50,
      }
      mockUseApiFetch.mockResolvedValueOnce(mockResponse)

      // Reset state and set pagination
      eventsComposable.typeFilter.value = null
      eventsComposable.search.value = ''
      eventsComposable.orderDirection.value = 'DESC'
      eventsComposable.orderBy.value = 'id'
      eventsComposable.pagination.page.value = 2
      eventsComposable.pagination.perPage.value = 10

      await eventsComposable.fetchEvents()

      expect(mockUseApiFetch).toHaveBeenCalledWith(
        '/events?page=2&perPage=10&orderDirection=DESC&orderBy=id',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      )
      expect(eventsComposable.pagination.totalPages.value).toBe(5)
    })

    it('should fetch events with custom ordering', async () => {
      const mockResponse = {
        events: mockEvents,
        total: 2,
      }
      mockUseApiFetch.mockResolvedValueOnce(mockResponse)

      // Reset state and set ordering
      eventsComposable.typeFilter.value = null
      eventsComposable.search.value = ''
      eventsComposable.orderBy.value = 'title'
      eventsComposable.orderDirection.value = 'ASC'
      eventsComposable.pagination.page.value = 1
      eventsComposable.pagination.perPage.value = 25

      await eventsComposable.fetchEvents()

      expect(mockUseApiFetch).toHaveBeenCalledWith(
        '/events?page=1&perPage=25&orderDirection=ASC&orderBy=title',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      )
    })

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error')
      mockUseApiFetch.mockRejectedValueOnce(error)

      await eventsComposable.fetchEvents()

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'API Error',
        life: 3000,
      })
      expect(eventsComposable.loading.value).toBe(false)
    })
  })

  describe('pagination calculations', () => {
    it('should calculate total pages correctly', async () => {
      const mockResponse = {
        events: mockEvents,
        total: 100,
      }
      mockUseApiFetch.mockResolvedValueOnce(mockResponse)

      eventsComposable.pagination.perPage.value = 25
      await eventsComposable.fetchEvents()

      expect(eventsComposable.pagination.totalPages.value).toBe(4)
    })

    it('should handle zero total results', async () => {
      const mockResponse = {
        events: [],
        total: 0,
      }
      mockUseApiFetch.mockResolvedValueOnce(mockResponse)

      await eventsComposable.fetchEvents()

      expect(eventsComposable.pagination.totalPages.value).toBe(0)
    })
  })
})
