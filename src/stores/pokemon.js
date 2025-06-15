import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pokemonApi } from '../services/pokemonApi'

export const usePokemonStore = defineStore('pokemon', () => {
  // State
  const pokemonList = ref([])
  const currentPokemon = ref(null)
  const currentEvolutionChain = ref([])
  const favorites = ref([]) // Now stores full Pokemon objects
  const loading = ref(false)
  const error = ref(null)
  const types = ref([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)

  // Update the initializeFavorites function to better handle invalid data
  const initializeFavorites = async () => {
    try {
      const stored = localStorage.getItem('pokemonFavorites')
      if (!stored) {
        favorites.value = []
        return
      }

      let parsed;
      try {
        parsed = JSON.parse(stored)
      } catch (e) {
        console.error('Invalid JSON in favorites, resetting...')
        favorites.value = []
        saveFavorites()
        return
      }
      
      if (!Array.isArray(parsed)) {
        console.error('Favorites is not an array, resetting...')
        favorites.value = []
        saveFavorites()
        return
      }

      if (parsed.length === 0) {
        favorites.value = []
        return
      }

      // Check first item to determine format
      const firstItem = parsed[0]
      
      if (typeof firstItem === 'number') {
        console.log('Migrating favorites from ID format to object format...')
        await migrateFavoritesFromIds(parsed.filter(id => typeof id === 'number'))
      } else if (typeof firstItem === 'object' && firstItem.id) {
        // New format - filter out invalid entries
        favorites.value = parsed.filter(p => p && p.id && typeof p.id === 'number')
      } else {
        console.warn('Invalid favorites format in localStorage, resetting...')
        favorites.value = []
      }
      
      saveFavorites()
    } catch (err) {
      console.error('Error loading favorites from localStorage:', err)
      favorites.value = []
      saveFavorites()
    }
  }

  // Update migrateFavoritesFromIds to be more defensive
  const migrateFavoritesFromIds = async (favoriteIds) => {
    try {
      const validIds = favoriteIds.filter(id => typeof id === 'number' && id > 0)
      console.log(`Migrating ${validIds.length} valid favorites...`)
      
      const pokemonPromises = validIds.map(async (id) => {
        try {
          return await pokemonApi.getPokemon(id)
        } catch (err) {
          console.warn(`Failed to migrate favorite Pokemon ${id}:`, err)
          return null
        }
      })

      const results = await Promise.allSettled(pokemonPromises)
      const migratedFavorites = results
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value)

      favorites.value = migratedFavorites
      saveFavorites()
      
      console.log(`Successfully migrated ${migratedFavorites.length} favorites`)
    } catch (err) {
      console.error('Error migrating favorites:', err)
      favorites.value = []
      saveFavorites()
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
    // Since favorites now contains full Pokemon objects, just return them
    return favorites.value
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

  const toggleFavorite = async (pokemon) => {
    if (!pokemon) return
    
    // Handle both full Pokemon objects and just IDs
    let pokemonObj = pokemon
    if (typeof pokemon === 'number' || typeof pokemon === 'string') {
      // If we got an ID, try to find the full Pokemon object
      pokemonObj = pokemonList.value.find(p => p.id === parseInt(pokemon)) ||
                   currentPokemon.value?.id === parseInt(pokemon) ? currentPokemon.value : null
      
      // If we can't find it in memory, fetch it
      if (!pokemonObj) {
        try {
          pokemonObj = await pokemonApi.getPokemon(pokemon)
        } catch (err) {
          console.error('Error fetching Pokemon for favorites:', err)
          return
        }
      }
    }
    
    if (!pokemonObj || !pokemonObj.id) return
    
    const index = favorites.value.findIndex(fav => fav.id === pokemonObj.id)
    if (index === -1) {
      // Add full Pokemon object to favorites
      favorites.value.push(pokemonObj)
    } else {
      // Remove from favorites
      favorites.value.splice(index, 1)
    }
    
    saveFavorites()
  }

  const addToFavorites = async (pokemon) => {
    if (!pokemon) return
    
    // Handle both full Pokemon objects and just IDs
    let pokemonObj = pokemon
    if (typeof pokemon === 'number' || typeof pokemon === 'string') {
      if (isFavorite(pokemon)) return
      
      // Try to find the full Pokemon object
      pokemonObj = pokemonList.value.find(p => p.id === parseInt(pokemon)) ||
                   currentPokemon.value?.id === parseInt(pokemon) ? currentPokemon.value : null
      
      // If we can't find it in memory, fetch it
      if (!pokemonObj) {
        try {
          pokemonObj = await pokemonApi.getPokemon(pokemon)
        } catch (err) {
          console.error('Error fetching Pokemon for favorites:', err)
          return
        }
      }
    } else if (isFavorite(pokemon.id)) {
      return
    }
    
    if (!pokemonObj || !pokemonObj.id) return
    
    favorites.value.push(pokemonObj)
    saveFavorites()
  }

  const removeFromFavorites = (pokemonId) => {
    const index = favorites.value.findIndex(fav => fav.id === pokemonId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  const isFavorite = (pokemonId) => {
    return favorites.value.some(fav => fav.id === pokemonId)
  }

  const clearAllFavorites = () => {
    favorites.value = []
    saveFavorites()
  }

  const loadFavorites = async () => {
    // Force re-initialization to handle any migration if needed
    await initializeFavorites()
    return favorites.value
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

  // Manual clear localStorage for debugging
  const resetFavoritesStorage = () => {
    localStorage.removeItem('pokemonFavorites')
    favorites.value = []
    console.log('Favorites storage cleared')
  }

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
    clearAllFavorites,
    loadFavorites,
    loadMorePokemon,
    getPokemonById,
    getPokemonByName,
    filterPokemonByType,
    filterPokemonByGeneration,
    sortPokemon,
    clearError,
    clearCurrentPokemon,
    reset,
    resetFavoritesStorage, // For debugging
    initializeFavorites // Make this available for manual calls
  }
})