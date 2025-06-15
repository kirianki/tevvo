import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WelcomeItem from '../WelcomeItem.vue'

describe('WelcomeItem', () => {
  it('renders properly', () => {
    const wrapper = mount(WelcomeItem)
    expect(wrapper.exists()).toBe(true)
  })
})
