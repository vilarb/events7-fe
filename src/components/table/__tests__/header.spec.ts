import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTableHeader from '../header.vue'

const mockState = {
  typeFilter: { value: null },
  fetchEvents: vi.fn(),
  eventTypes: { value: ['crosspromo', 'liveops', 'app', 'ads'] },
}

vi.mock('@/composables/events', () => ({
  useEvents: () => mockState,
}))

describe('Header', () => {
  it('renders properly', () => {
    const wrapper = mount(AppTableHeader)
    expect(wrapper.exists()).toBe(true)
  })

  it('sets correct filter option to composable value', () => {
    const wrapper = mount(AppTableHeader)
    const filterOptions = wrapper.findAll('[data-test-id="filter-option"]')

    filterOptions.forEach((option) => {
      option.trigger('click')
      expect(mockState.typeFilter.value).toBe(
        option.attributes('data-test-value') === 'all'
          ? null
          : option.attributes('data-test-value'),
      )
    })
  })
})
