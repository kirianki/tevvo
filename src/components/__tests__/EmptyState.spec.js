import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '../EmptyState.vue'

describe('EmptyState', () => {
  it('renders properly', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.exists()).toBe(true)
  })
})
