import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import EventPriority from '../eventPriority.vue'
import type { Event } from '@/types/event'

describe('EventPriority', () => {
  const createWrapper = (
    priority: Event['priority'],
  ): VueWrapper<InstanceType<typeof EventPriority>> => {
    return mount(EventPriority, {
      props: { priority },
    })
  }

  it('renders properly with priority value', () => {
    const wrapper = createWrapper(5)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('5')
  })

  describe('priority level styling', () => {
    describe('low priority (1-3)', () => {
      it('shows only green bar for priority 1', () => {
        const wrapper = createWrapper(1)
        const bars = wrapper.findAll('.w-\\[4px\\]')

        expect(bars[0].classes()).toContain('bg-green-500')
        expect(bars[1].classes()).toContain('bg-gray-300')
        expect(bars[2].classes()).toContain('bg-gray-300')
        expect(bars[3].classes()).toContain('bg-gray-300')
      })

      it('shows only green bar for priority 3', () => {
        const wrapper = createWrapper(3)
        const bars = wrapper.findAll('.w-\\[4px\\]')

        expect(bars[0].classes()).toContain('bg-green-500')
        expect(bars[1].classes()).toContain('bg-gray-300')
        expect(bars[2].classes()).toContain('bg-gray-300')
        expect(bars[3].classes()).toContain('bg-gray-300')
      })
    })

    describe('medium priority (4-5)', () => {
      it('shows green and yellow bars for priority 4', () => {
        const wrapper = createWrapper(4)
        const bars = wrapper.findAll('.w-\\[4px\\]')

        expect(bars[0].classes()).toContain('bg-green-500')
        expect(bars[1].classes()).toContain('!bg-yellow-500')
        expect(bars[2].classes()).toContain('bg-gray-300')
        expect(bars[3].classes()).toContain('bg-gray-300')
      })

      it('shows green and yellow bars for priority 5', () => {
        const wrapper = createWrapper(5)
        const bars = wrapper.findAll('.w-\\[4px\\]')

        expect(bars[0].classes()).toContain('bg-green-500')
        expect(bars[1].classes()).toContain('!bg-yellow-500')
        expect(bars[2].classes()).toContain('bg-gray-300')
        expect(bars[3].classes()).toContain('bg-gray-300')
      })
    })

    describe('high priority (6-8)', () => {
      it('shows green, yellow, and orange bars for priority 6', () => {
        const wrapper = createWrapper(6)
        const bars = wrapper.findAll('.w-\\[4px\\]')

        expect(bars[0].classes()).toContain('bg-green-500')
        expect(bars[1].classes()).toContain('!bg-yellow-500')
        expect(bars[2].classes()).toContain('!bg-orange-500')
        expect(bars[3].classes()).toContain('bg-gray-300')
      })

      it('shows green, yellow, and orange bars for priority 8', () => {
        const wrapper = createWrapper(8)
        const bars = wrapper.findAll('.w-\\[4px\\]')

        expect(bars[0].classes()).toContain('bg-green-500')
        expect(bars[1].classes()).toContain('!bg-yellow-500')
        expect(bars[2].classes()).toContain('!bg-orange-500')
        expect(bars[3].classes()).toContain('bg-gray-300')
      })
    })

    describe('critical priority (9-10)', () => {
      it('shows all colored bars for priority 9', () => {
        const wrapper = createWrapper(9)
        const bars = wrapper.findAll('.w-\\[4px\\]')

        expect(bars[0].classes()).toContain('bg-green-500')
        expect(bars[1].classes()).toContain('!bg-yellow-500')
        expect(bars[2].classes()).toContain('!bg-orange-500')
        expect(bars[3].classes()).toContain('!bg-red-500')
      })

      it('shows all colored bars for priority 10', () => {
        const wrapper = createWrapper(10)
        const bars = wrapper.findAll('.w-\\[4px\\]')

        expect(bars[0].classes()).toContain('bg-green-500')
        expect(bars[1].classes()).toContain('!bg-yellow-500')
        expect(bars[2].classes()).toContain('!bg-orange-500')
        expect(bars[3].classes()).toContain('!bg-red-500')
      })
    })
  })
})
