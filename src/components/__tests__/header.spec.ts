import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../header.vue'
import { useEvents } from '@/composables/events'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
    remove: vi.fn(),
    removeAll: vi.fn(),
  }),
}))

describe('AppHeader', () => {
  it('renders properly', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.exists()).toBe(true)
  })

  it('sets search input value to composable value', () => {
    const { search } = useEvents()

    const wrapper = mount(AppHeader)
    const searchInput = wrapper.find('input')
    searchInput.setValue('test')
    expect(searchInput.element.value).toBe('test')

    expect(search.value).toBe('test')
  })

  it('opens docs in a new tab', () => {
    Object.defineProperty(window, 'open', {
      writable: true,
      value: vi.fn(),
    })

    const wrapper = mount(AppHeader)
    const docsButton = wrapper.find('[data-test-id="docs-button"]')
    docsButton.trigger('click')
    expect(window.open).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/docs`, '_blank')
  })
})
