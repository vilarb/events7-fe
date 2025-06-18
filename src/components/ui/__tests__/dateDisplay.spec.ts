import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import DateDisplay from '../dateDisplay.vue'

describe('DateDisplay', () => {
  let wrapper: VueWrapper<InstanceType<typeof DateDisplay>>

  beforeEach(() => {
    wrapper = mount(DateDisplay, {
      props: {
        date: '2025-01-01T00:00:00Z',
      },
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the date in the correct format', () => {
    expect(wrapper.text()).toContain('Jan 1, 2025, 1:00 AM')
  })
})
