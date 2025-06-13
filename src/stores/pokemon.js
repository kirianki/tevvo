import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pokemonApi } from '../services/pokemonApi'

export const usePokemonStore = defineStore('pokemon', () => {
  // State
  const pokemonList = ref([])
  const currentPokemon = ref(null)
  const currentEvolutionChain = ref([])
  const favorites = ref([])
  const loading = ref(false)
  const error = ref(null)
  const types = ref([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)

  // Initialize favorites from localStorage
  const initializeFavorites = () => {
    try {
      const stored = localStorage.getItem('pokemonFavorites')
      favorites.value = stored ? JSON.parse(stored) : []
    } catch (err) {
      console.error('Error loading favorites from localStorage:', err)
      favorites.value = []
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    try {
      localStorage.setItem('pokemonFavorites', JSON.stringify(favorites.value))
    } catch (err) {
      console.error('Error saving favorites to localStorage:', err)
    }
  }

  // Computed properties
  const favoritePokemon = computed(() => {
    return pokemonList.value.filter(pokemon => favorites.value.includes(pokemon.id))
  })

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)
  const hasPokemon = computed(() => pokemonList.value.length > 0)

  // Actions
  const fetchPokemonList = async (limit = 20, offset = 0) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await pokemonApi.getPokemonList(limit, offset)
      
      if (offset === 0) {
        // If this is the first page, replace the list
        pokemonList.value = data.results
      } else {
        // If this is a subsequent page, append to the list
        pokemonList.value = [...pokemonList.value, ...data.results]
      }
      
      totalCount.value = data.count
      currentPage.value = Math.floor(offset / limit) + 1
      
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error in fetchPokemonList:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPokemon = async (id) => {
    loading.value = true
    error.value = null
    currentPokemon.value = null
    currentEvolutionChain.value = []
    
    try {
      // Fetch basic Pokemon data
      const pokemon = await pokemonApi.getPokemon(id)
      currentPokemon.value = pokemon
      
      // Fetch evolution chain
      try {
        const species = await pokemonApi.getPokemonSpecies(id)
        const evolutionData = await pokemonApi.getEvolutionChain(species.evolution_chain.url)
        currentEvolutionChain.value = await pokemonApi.parseEvolutionChain(evolutionData)
      } catch (evolutionErr) {
        console.warn('Could not fetch evolution chain:', evolutionErr)
        currentEvolutionChain.value = []
      }
      
      return pokemon
    } catch (err) {
      error.value = err.message
      console.error(`Error fetching Pokemon ${id}:`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchPokemon = async (query) => {
    if (!query || query.trim() === '') {
      return []
    }
    
    loading.value = true
    error.value = null
    
    try {
      // First try exact match
      try {
        const exactMatch = await pokemonApi.searchPokemon(query)
        return [exactMatch]
      } catch {
        // If exact match fails, search in current list
        const lowerQuery = query.toLowerCase()
        return pokemonList.value.filter(pokemon => 
          pokemon.name.toLowerCase().includes(lowerQuery)
        )
      }
    } catch (err) {
      error.value = err.message
      console.error('Error searching Pokemon:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchTypes = async () => {
    if (types.value.length > 0) {
      return types.value
    }
    
    try {
      types.value = await pokemonApi.getTypes()
      return types.value
    } catch (err) {
      console.error('Error fetching types:', err)
      // Fallback to hardcoded types
      types.value = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ]
      return types.value
    }
  }

  const toggleFavorite = (pokemonId) => {
    if (!pokemonId) return
    
    const index = favorites.value.indexOf(pokemonId)
    if (index === -1) {
      favorites.value.push(pokemonId)
    } else {
      favorites.value.splice(index, 1)
    }
    
    saveFavorites()
  }

  const addToFavorites = (pokemonId) => {
    if (!pokemonId || favorites.value.includes(pokemonId)) return
    
    favorites.value.push(pokemonId)
    saveFavorites()
  }

  const removeFromFavorites = (pokemonId) => {
    const index = favorites.value.indexOf(pokemonId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  const isFavorite = (pokemonId) => {
    return favorites.value.includes(pokemonId)
  }

  const loadMorePokemon = async () => {
    const nextOffset = pokemonList.value.length
    return fetchPokemonList(itemsPerPage.value, nextOffset)
  }

  const getPokemonById = (id) => {
    return pokemonList.value.find(pokemon => pokemon.id === parseInt(id))
  }

  const getPokemonByName = (name) => {
    return pokemonList.value.find(pokemon => 
      pokemon.name.toLowerCase() === name.toLowerCase()
    )
  }

  const filterPokemonByType = (type) => {
    if (!type) return pokemonList.value
    
    return pokemonList.value.filter(pokemon =>
      pokemon.types?.some(t => t.type.name === type)
    )
  }

  const filterPokemonByGeneration = (generation) => {
    if (!generation) return pokemonList.value
    
    const genRanges = {
      '1': [1, 151],
      '2': [152, 251], 
      '3': [252, 386],
      '4': [387, 493],
      '5': [494, 649],
      '6': [650, 721],
      '7': [722, 809],
      '8': [810, 905],
      '9': [906, 1010]
    }
    
    const [min, max] = genRanges[generation] || [0, 0]
    return pokemonList.value.filter(pokemon => 
      pokemon.id >= min && pokemon.id <= max
    )
  }

  const sortPokemon = (sortBy) => {
    const sorted = [...pokemonList.value]
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'id':
        return sorted.sort((a, b) => a.id - b.id)
      case 'id-desc':
        return sorted.sort((a, b) => b.id - a.id)
      case 'type':
        return sorted.sort((a, b) => {
          const aType = a.types?.[0]?.type.name || ''
          const bType = b.types?.[0]?.type.name || ''
          return aType.localeCompare(bType)
        })
      default:
        return sorted
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentPokemon = () => {
    currentPokemon.value = null
    currentEvolutionChain.value = []
  }

  const reset = () => {
    pokemonList.value = []
    currentPokemon.value = null
    currentEvolutionChain.value = []
    loading.value = false
    error.value = null
    totalCount.value = 0
    currentPage.value = 1
  }

  // Initialize favorites on store creation
  initializeFavorites()

  return {
    // State
    pokemonList,
    currentPokemon,
    currentEvolutionChain,
    favorites,
    loading,
    error,
    types,
    totalCount,
    currentPage,
    itemsPerPage,
    
    // Computed
    favoritePokemon,
    isLoading,
    hasError,
    hasPokemon,
    
    // Actions
    fetchPokemonList,
    fetchPokemon,
    searchPokemon,
    fetchTypes,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loadMorePokemon,
    getPokemonById,
    getPokemonByName,
    filterPokemonByType,
    filterPokemonByGeneration,
    sortPokemon,
    clearError,
    clearCurrentPokemon,
    reset
  }
})