import { useApiFetch } from '@/composables/baseApi'
import type { Event } from '@/types/event'

export const useEventApi = () => {
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
    createEvent,
    fetchEvent,
    updateEvent,
    deleteEvent,
  }
}
