import { useApiFetch } from '@/composables/baseApi'
import type { Event } from '@/types/event'

/**
 * Event API composable for CRUD operations
 *
 * @property {Function} createEvent - The function to create a new event
 * @property {Function} fetchEvent - The function to fetch an event
 * @property {Function} updateEvent - The function to update an event
 * @property {Function} deleteEvent - The function to delete an event
 *
 * @returns {Object} Event API composable
 */
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
