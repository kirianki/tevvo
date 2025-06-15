import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconEcosystem from '../IconEcosystem.vue'

describe('IconEcosystem', () => {
  it('renders properly', () => {
    const wrapper = mount(IconEcosystem)
    expect(wrapper.exists()).toBe(true)
  })
})
