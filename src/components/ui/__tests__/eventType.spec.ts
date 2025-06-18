import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EventType from '../eventType.vue'
import { useEvents } from '../../../composables/events'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
    remove: vi.fn(),
    removeAll: vi.fn(),
  }),
}))

describe('EventType', () => {
  useEvents().eventTypes.value.forEach((type) => {
    it(`renders properly for type "${type}"`, () => {
      const wrapper = mount(EventType, {
        props: { type },
      })
      expect(wrapper.text().toLowerCase()).toContain(type)
      expect(wrapper.exists()).toBe(true)
    })
  })
})
