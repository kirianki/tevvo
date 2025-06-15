import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconDocumentation from '../IconDocumentation.vue'

describe('IconDocumentation', () => {
  it('renders properly', () => {
    const wrapper = mount(IconDocumentation)
    expect(wrapper.exists()).toBe(true)
  })
})
