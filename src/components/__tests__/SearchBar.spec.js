import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../SearchBar.vue'

describe('SearchBar', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchBar)
    expect(wrapper.exists()).toBe(true)
  })
})
