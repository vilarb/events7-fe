/**
 * Base event interface for the database
 */
export interface Event {
  id: number
  title: string
  description: string
  type: 'crosspromo' | 'liveops' | 'app' | 'ads'
  priority: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  createdAt: string
  updatedAt: string
}

/**
 * Event form data interface
 */
export type EventFormData = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
