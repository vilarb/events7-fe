import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ConfirmPopup from '../confirmPopup.vue'
import PrimeVue from 'primevue/config'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

describe('ConfirmPopup', () => {
  let wrapper: VueWrapper<InstanceType<typeof ConfirmPopup>>

  beforeEach(() => {
    wrapper = mount(ConfirmPopup, {
      props: {
        visible: true,
        confirmLabel: 'Test confirm',
        confirmSeverity: 'danger',
        cancelLabel: 'Test cancel',
        loading: false,
      },
      global: {
        plugins: [
          [
            PrimeVue,
            {
              ripple: true,
            },
          ],
        ],
        components: {
          Dialog,
          Button,
        },
        stubs: {
          Portal: {
            template: '<div><slot /></div>',
          },
        },
      },
    })
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('updates visible prop when cancel button is clicked', async () => {
    const cancel-button = wrapper.find('[data-test-id=\"cancel-button\"]')

    // Check that the cancel button is rendered
    expect(cancel-button.text()).toContain('Test cancel')

    // Set cancelLabel prop to undefined and check that the default cancel label is rendered
    await wrapper.setProps({ cancelLabel: undefined })
    await wrapper.vm.$nextTick()
    expect(cancel-button.text()).toContain('Cancel')

    // Click the cancel button and check that the visible prop is updated to false
    await wrapper.find('[data-test-id=\"cancel-button\"]').trigger('click')

    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
  })

  it('emits confirm event when confirm button is clicked and renders correct label', async () => {
    const confirm-button = wrapper.find('[data-test-id=\"confirm-button\"]')

    // Check that the confirm button is rendered
    expect(confirm-button.text()).toContain('Test confirm')

    // Set confirmLabel prop to undefined and check that the default confirm label is rendered
    await wrapper.setProps({ confirmLabel: undefined })
    await wrapper.vm.$nextTick()
    expect(confirm-button.text()).toContain('Confirm')

    // Click the confirm button and check that the confirm event is emitted
    await confirm-button.trigger('click')

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')?.[0]).toEqual([])
  })
})
