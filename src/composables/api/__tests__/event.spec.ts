import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useEventApi } from '../../api/event'
import type { Event } from '../../../types/event'
import { useApiFetch } from '../../baseApi'

vi.mock('../../baseApi', () => ({
  useApiFetch: vi.fn(),
}))

describe('useEventApi', () => {
  const { createEvent, fetchEvent, updateEvent, deleteEvent } = useEventApi()
  const mockEvent: Event = {
    id: 1,
    title: 'Test Event',
    description: 'Test Description',
    type: 'app',
    priority: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createEvent', () => {
    const newEvent = {
      title: 'New Event',
      description: 'New Description',
      type: 'app' as const,
      priority: 1 as const,
    }

    it('creates an event successfully', async () => {
      vi.mocked(useApiFetch).mockResolvedValue(mockEvent)

      const result = await createEvent(newEvent)
      expect(result).toEqual(mockEvent)
      expect(useApiFetch).toHaveBeenCalledWith('/events', {
        method: 'POST',
        body: JSON.stringify(newEvent),
      })
    })

    it('handles errors when creating event', async () => {
      const mockError = new Error('Failed to create event')
      vi.mocked(useApiFetch).mockRejectedValue(mockError)

      await expect(createEvent(newEvent)).rejects.toThrow('Failed to create event')
    })
  })

  describe('fetchEvent', () => {
    it('fetches an event successfully', async () => {
      vi.mocked(useApiFetch).mockResolvedValue(mockEvent)

      const result = await fetchEvent(1)
      expect(result).toEqual(mockEvent)
      expect(useApiFetch).toHaveBeenCalledWith('/events/1')
    })

    it('handles errors when fetching event', async () => {
      const mockError = new Error('Event not found')
      vi.mocked(useApiFetch).mockRejectedValue(mockError)

      await expect(fetchEvent(1)).rejects.toThrow('Event not found')
    })
  })

  describe('updateEvent', () => {
    it('updates an event successfully', async () => {
      vi.mocked(useApiFetch).mockResolvedValue(mockEvent)

      const result = await updateEvent(mockEvent)
      expect(result).toEqual(mockEvent)
      expect(useApiFetch).toHaveBeenCalledWith('/events/1', {
        method: 'PATCH',
        body: JSON.stringify(mockEvent),
      })
    })

    it('handles errors when updating event', async () => {
      const mockError = new Error('Failed to update event')
      vi.mocked(useApiFetch).mockRejectedValue(mockError)

      await expect(updateEvent(mockEvent)).rejects.toThrow('Failed to update event')
    })
  })

  describe('deleteEvent', () => {
    it('deletes an event successfully', async () => {
      vi.mocked(useApiFetch).mockResolvedValue(undefined)

      await deleteEvent(1)
      expect(useApiFetch).toHaveBeenCalledWith('/events/1', {
        method: 'DELETE',
      })
    })

    it('handles errors when deleting event', async () => {
      const mockError = new Error('Failed to delete event')
      vi.mocked(useApiFetch).mockRejectedValue(mockError)

      await expect(deleteEvent(1)).rejects.toThrow('Failed to delete event')
    })
  })
})
