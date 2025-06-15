import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PokemonCard from '../PokemonCard.vue'

describe('PokemonCard', () => {
  it('renders properly', () => {
    const wrapper = mount(PokemonCard)
    expect(wrapper.exists()).toBe(true)
  })
})
