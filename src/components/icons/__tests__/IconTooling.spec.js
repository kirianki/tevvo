import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconTooling from '../IconTooling.vue'

describe('IconTooling', () => {
  it('renders properly', () => {
    const wrapper = mount(IconTooling)
    expect(wrapper.exists()).toBe(true)
  })
})
