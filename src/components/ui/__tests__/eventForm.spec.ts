import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import EventForm from '../eventForm.vue'
import type { EventFormData } from '../../../types/event'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'

describe('EventForm', () => {
  let wrapper: VueWrapper<InstanceType<typeof EventForm>>

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    wrapper = mount(EventForm, {
      props: {
        modelValue: {
          title: '',
          description: '',
          type: 'crosspromo',
          priority: 1,
        },
        invalidAdsType: false,
      },
      global: {
        plugins: [
          [
            PrimeVue,
            {
              ripple: true,
            },
          ],
          ToastService,
        ],
        components: {
          InputText,
          Textarea,
          Select,
          InputNumber,
        },
        stubs: {
          Slider: true,
          AppUiEventType: true,
        },
      },
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('updates model value when form fields change', async () => {
    // Test title field
    const titleInput = wrapper.findComponent(InputText)
    await titleInput.setValue('New Event')
    expect((wrapper.props('modelValue') as EventFormData).title).toBe('New Event')

    // Test description field
    const descriptionInput = wrapper.findComponent(Textarea)
    await descriptionInput.setValue('Event description')
    expect((wrapper.props('modelValue') as EventFormData).description).toBe('Event description')

    // Test type field
    const typeSelect = wrapper.findComponent(Select)
    await typeSelect.setValue('liveops')
    expect((wrapper.props('modelValue') as EventFormData).type).toBe('liveops')

    // Test priority field
    const priorityInput = wrapper.findComponent(InputNumber)
    await priorityInput.setValue(5)
    expect((wrapper.props('modelValue') as EventFormData).priority).toBe(5)

    // Verify final form state
    const modelValue = wrapper.props('modelValue') as EventFormData
    expect(modelValue).toEqual({
      title: 'New Event',
      description: 'Event description',
      type: 'liveops',
      priority: 5,
    })
  })

  it('shows error message when invalidAdsType is true', async () => {
    await wrapper.setProps({ invalidAdsType: true })
    const errorMessage = wrapper.find('.text-red-500')
    expect(errorMessage.exists()).toBe(true)
  })

  // Add more test cases for validation, error states, etc.
})
