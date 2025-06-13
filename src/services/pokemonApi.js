const BASE_URL = 'https://pokeapi.co/api/v2'

// Cache for API responses to improve performance
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to get cached data or fetch new data
async function getCachedData(key, fetchFn) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  const data = await fetchFn()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}

// Helper function to extract Pokemon ID from URL
function extractIdFromUrl(url) {
  return url.split('/').slice(-2, -1)[0]
}

// Helper function to handle API errors
function handleApiError(response, context) {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`${context} not found`)
    }
    throw new Error(`Failed to fetch ${context}: ${response.status} ${response.statusText}`)
  }
}

export const pokemonApi = {
  /**
   * Fetch a list of Pokemon with their basic details
   * @param {number} limit - Number of Pokemon to fetch
   * @param {number} offset - Starting offset for pagination
   * @returns {Promise<{count: number, results: Array}>}
   */
  async getPokemonList(limit = 20, offset = 0) {
    const cacheKey = `pokemon-list-${limit}-${offset}`
    
    return getCachedData(cacheKey, async () => {
      try {
        const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
        handleApiError(response, 'Pokémon list')
        
        const data = await response.json()
        
        // Fetch detailed information for each Pokemon
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon) => {
            const id = extractIdFromUrl(pokemon.url)
            return this.getPokemon(id)
          })
        )
        
        return {
          count: data.count,
          next: data.next,
          previous: data.previous,
          results: detailedPokemon
        }
      } catch (error) {
        console.error('Error fetching Pokemon list:', error)
        throw error
      }
    })
  },

  /**
   * Fetch detailed information for a specific Pokemon
   * @param {string|number} id - Pokemon ID or name
   * @returns {Promise<Object>}
   */
  async getPokemon(id) {
    const cacheKey = `pokemon-${id}`
    
    return getCachedData(cacheKey, async () => {
      try {
        const response = await fetch(`${BASE_URL}/pokemon/${id}`)
        handleApiError(response, `Pokémon ${id}`)
        
        const pokemon = await response.json()
        
        // Ensure we have the official artwork or fallback to default sprite
        if (!pokemon.sprites.other?.['official-artwork']?.front_default) {
          pokemon.sprites.other = pokemon.sprites.other || {}
          pokemon.sprites.other['official-artwork'] = {
            front_default: pokemon.sprites.front_default
          }
        }
        
        return pokemon
      } catch (error) {
        console.error(`Error fetching Pokemon ${id}:`, error)
        throw error
      }
    })
  },

  /**
   * Fetch Pokemon species information (includes evolution chain, flavor text, etc.)
   * @param {string|number} id - Pokemon ID or name
   * @returns {Promise<Object>}
   */
  async getPokemonSpecies(id) {
    const cacheKey = `species-${id}`
    
    return getCachedData(cacheKey, async () => {
      try {
        const response = await fetch(`${BASE_URL}/pokemon-species/${id}`)
        handleApiError(response, `species for Pokémon ${id}`)
        
        return await response.json()
      } catch (error) {
        console.error(`Error fetching species for Pokemon ${id}:`, error)
        throw error
      }
    })
  },

  /**
   * Fetch evolution chain information
   * @param {string} evolutionChainUrl - Evolution chain URL from species data
   * @returns {Promise<Object>}
   */
  async getEvolutionChain(evolutionChainUrl) {
    const cacheKey = `evolution-${evolutionChainUrl}`
    
    return getCachedData(cacheKey, async () => {
      try {
        const response = await fetch(evolutionChainUrl)
        handleApiError(response, 'evolution chain')
        
        return await response.json()
      } catch (error) {
        console.error('Error fetching evolution chain:', error)
        throw error
      }
    })
  },

  /**
   * Parse evolution chain data into a flat array
   * @param {Object} chainData - Evolution chain data from API
   * @returns {Promise<Array>}
   */
  async parseEvolutionChain(chainData) {
    const evolutions = []
    let current = chainData.chain

    while (current) {
      try {
        const pokemonId = extractIdFromUrl(current.species.url)
        const pokemon = await this.getPokemon(pokemonId)
        
        evolutions.push({
          id: parseInt(pokemonId),
          name: current.species.name,
          image: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default,
          minLevel: current.evolution_details[0]?.min_level || null,
          trigger: current.evolution_details[0]?.trigger?.name || null
        })
        
        current = current.evolves_to[0] || null
      } catch (error) {
        console.error('Error parsing evolution chain:', error)
        break
      }
    }

    return evolutions
  },

  /**
   * Fetch all Pokemon types
   * @returns {Promise<Array>}
   */
  async getTypes() {
    const cacheKey = 'pokemon-types'
    
    return getCachedData(cacheKey, async () => {
      try {
        const response = await fetch(`${BASE_URL}/type`)
        handleApiError(response, 'Pokémon types')
        
        const data = await response.json()
        return data.results.map(type => type.name)
      } catch (error) {
        console.error('Error fetching Pokemon types:', error)
        throw error
      }
    })
  },

  /**
   * Search for a Pokemon by name
   * @param {string} name - Pokemon name to search for
   * @returns {Promise<Object>}
   */
  async searchPokemon(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid Pokemon name')
    }
    
    const cleanName = name.toLowerCase().trim()
    return this.getPokemon(cleanName)
  },

  /**
   * Fetch ability information
   * @param {string} abilityUrl - Ability URL from Pokemon data
   * @returns {Promise<Object>}
   */
  async getAbility(abilityUrl) {
    const cacheKey = `ability-${abilityUrl}`
    
    return getCachedData(cacheKey, async () => {
      try {
        const response = await fetch(abilityUrl)
        handleApiError(response, 'ability')
        
        const ability = await response.json()
        
        // Get English description
        const englishEntry = ability.effect_entries.find(entry => entry.language.name === 'en')
        
        return {
          name: ability.name,
          description: englishEntry?.effect || 'No description available.'
        }
      } catch (error) {
        console.error('Error fetching ability:', error)
        return {
          name: 'unknown',
          description: 'Description not available.'
        }
      }
    })
  },

  /**
   * Fetch multiple Pokemon by IDs (for batch operations)
   * @param {Array<number>} ids - Array of Pokemon IDs
   * @returns {Promise<Array>}
   */
  async getMultiplePokemon(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return []
    }
    
    try {
      const promises = ids.map(id => this.getPokemon(id))
      const results = await Promise.allSettled(promises)
      
      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
    } catch (error) {
      console.error('Error fetching multiple Pokemon:', error)
      throw error
    }
  },

  /**
   * Clear the API cache
   */
  clearCache() {
    cache.clear()
  },

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getCacheStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    }
  }
}