import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconCommunity from '../IconCommunity.vue'

describe('IconCommunity', () => {
  it('renders properly', () => {
    const wrapper = mount(IconCommunity)
    expect(wrapper.exists()).toBe(true)
  })
})
