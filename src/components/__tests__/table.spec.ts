import { describe, it, expect, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import AppTable from '../table.vue'
import { useEvents } from '@/composables/events'
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import type { DataTablePageEvent } from 'primevue'
import { beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
    remove: vi.fn(),
    removeAll: vi.fn(),
  }),
}))

describe('AppTable', () => {
  let wrapper: VueWrapper<InstanceType<typeof AppTable>>

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

  beforeEach(() => {
    // Create a minimal router instance
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' },
        },
      ],
    })

    wrapper = mount(AppTable, {
      global: {
        plugins: [PrimeVue, router],
        components: {
          DataTable,
          Column,
          Button,
        },
        stubs: {
          AppTableHeader: true,
          AppUiEventType: true,
          AppUiDateDisplay: true,
        },
      },
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('Check that changeTablePage updates the page and perPage values', () => {
    const { pagination } = useEvents()

    const changeTablePage = wrapper.vm.changeTablePage

    changeTablePage({ page: 0, rows: 10 } as DataTablePageEvent)
    expect(pagination.page.value).toBe(1)
    expect(pagination.perPage.value).toBe(10)

    changeTablePage({ page: 1, rows: 25 } as DataTablePageEvent)
    expect(pagination.page.value).toBe(2)
    expect(pagination.perPage.value).toBe(25)
  })
})
