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
})
