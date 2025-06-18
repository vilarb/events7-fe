import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import CreateEvent from '../createEvent.vue'
import PrimeVue from 'primevue/config'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import { useEvents } from '@/composables/events'
import type { Event } from '@/types/event'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
    remove: vi.fn(),
    removeAll: vi.fn(),
  }),
}))

const mockCreateEvent = vi.fn()
vi.mock('../../../composables/api/event', () => ({
  useEventApi: () => ({
    createEvent: mockCreateEvent,
  }),
}))

describe('CreateEvent', () => {
  let wrapper: VueWrapper<InstanceType<typeof CreateEvent>>

  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    wrapper = mount(CreateEvent, {
      global: {
        plugins: [[PrimeVue, { ripple: true }]],
        components: {
          Dialog,
          Button,
          InputText,
          Textarea,
          Select,
          InputNumber,
        },
        stubs: {
          AppUiEventType: true,
          Slider: true,
          Teleport: {
            template: '<div><slot /></div>',
          },
        },
      },
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('creates an event when form is filled and Create is clicked', async () => {
    const { createEventDialogOpen } = useEvents()
    createEventDialogOpen.value = true

    // Wait for dialog to be visible
    await wrapper.vm.$nextTick()

    const testEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Test Event',
      description: 'Test Description',
      type: 'liveops',
      priority: 5,
    }

    // Fill out the form
    wrapper.vm.newEvent = testEvent

    // Find and click the create button
    const createButton = wrapper.find('[data-test-id="createButton"]')
    expect(createButton.exists()).toBe(true)
    await createButton.trigger('click')

    // Verify that createEvent was called with the correct data
    expect(mockCreateEvent).toHaveBeenCalledWith(testEvent)
  })
})
