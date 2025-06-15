import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconSupport from '../IconSupport.vue'

describe('IconSupport', () => {
  it('renders properly', () => {
    const wrapper = mount(IconSupport)
    expect(wrapper.exists()).toBe(true)
  })
})
