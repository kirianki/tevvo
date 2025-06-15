<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p class="mt-2 text-gray-600">
              {{ favoritePokemon.length }} Pokémon in your collection
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="clearAllFavorites"
              v-if="favoritePokemon.length > 0"
              class="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Clear All
            </button>
            <router-link
              to="/pokedex"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Browse Pokédex
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p class="text-red-800">{{ error }}</p>
          <button 
            @click="retryLoad" 
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="favoritePokemon.length === 0"
        icon="heart"
        title="No favorites yet"
        description="Start adding Pokémon to your favorites to see them here"
        :action="{
          text: 'Explore Pokédex',
          to: '/pokedex'
        }"
      />

      <!-- Favorites Grid -->
      <div v-else>
        <!-- Search and Filter -->
        <div class="mb-6 flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search your favorites..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <select
            v-model="selectedType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option v-for="type in uniqueTypes" :key="type" :value="type">
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </option>
          </select>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <PokemonCard
            v-for="pokemon in filteredFavorites"
            :key="`favorite-${pokemon.id}`"
            :pokemon="pokemon"
            :is-favorite="true"
            @toggle-favorite="handleToggleFavorite"
            @click="navigateToDetail(pokemon.id)"
            class="transform hover:scale-105 transition-transform duration-200 cursor-pointer"
          />
        </div>

        <!-- No results message -->
        <div v-if="filteredFavorites.length === 0 && (searchQuery || selectedType)" class="text-center py-8">
          <p class="text-gray-500">No Pokémon match your search criteria.</p>
          <button 
            @click="clearFilters" 
            class="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            Clear filters
          </button>
        </div>

        <!-- Stats Section -->
        <div class="mt-12 bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Collection Stats</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">{{ favoritePokemon.length }}</div>
              <div class="text-gray-600">Total Favorites</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">{{ uniqueTypes.length }}</div>
              <div class="text-gray-600">Different Types</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600">{{ averageStats.hp || 0 }}</div>
              <div class="text-gray-600">Average HP</div>
            </div>
          </div>
          
          <!-- Additional Stats Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">{{ averageStats.attack || 0 }}</div>
              <div class="text-gray-600">Average Attack</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-indigo-600">{{ averageStats.defense || 0 }}</div>
              <div class="text-gray-600">Average Defense</div>
            </div>
          </div>
          
          <!-- Type Distribution -->
          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Type Distribution</h3>
            <div class="flex flex-wrap gap-2">
              <TypeBadge
                v-for="type in typeDistribution"
                :key="type.name"
                :type="type.name"
                :count="type.count"
                show-count
              />
            </div>
          </div>

          <!-- Generation Distribution -->
          <div class="mt-6" v-if="generationDistribution.length > 0">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Generation Distribution</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <div 
                v-for="gen in generationDistribution" 
                :key="gen.generation"
                class="bg-gray-100 rounded-lg p-3 text-center"
              >
                <div class="text-lg font-bold text-gray-900">{{ gen.count }}</div>
                <div class="text-sm text-gray-600">Gen {{ gen.generation }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '../stores/pokemon'
import PokemonCard from '../components/PokemonCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import EmptyState from '../components/EmptyState.vue'
import TypeBadge from '../components/TypeBadge.vue'

const router = useRouter()
const pokemonStore = usePokemonStore()

// Reactive state
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const selectedType = ref('')
const favoritePokemon = ref([])

// Computed properties
const favorites = computed(() => pokemonStore.favorites || [])

const uniqueTypes = computed(() => {
  const types = new Set()
  favoritePokemon.value.forEach(pokemon => {
    if (pokemon.types && Array.isArray(pokemon.types)) {
      pokemon.types.forEach(type => {
        if (type && type.type && type.type.name) {
          types.add(type.type.name)
        }
      })
    }
  })
  return Array.from(types).sort()
})

const filteredFavorites = computed(() => {
  let filtered = favoritePokemon.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query) ||
      pokemon.id.toString().includes(query)
    )
  }

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(pokemon => 
      pokemon.types && pokemon.types.some(type => 
        type.type && type.type.name === selectedType.value
      )
    )
  }

  return filtered
})

const averageStats = computed(() => {
  if (favoritePokemon.value.length === 0) return { hp: 0, attack: 0, defense: 0 }
  
  const totals = favoritePokemon.value.reduce((acc, pokemon) => {
    if (!pokemon.stats || !Array.isArray(pokemon.stats)) {
      return acc
    }

    const hpStat = pokemon.stats.find(stat => stat.stat && stat.stat.name === 'hp')
    const attackStat = pokemon.stats.find(stat => stat.stat && stat.stat.name === 'attack')
    const defenseStat = pokemon.stats.find(stat => stat.stat && stat.stat.name === 'defense')
    
    return {
      hp: acc.hp + (hpStat?.base_stat || 0),
      attack: acc.attack + (attackStat?.base_stat || 0),
      defense: acc.defense + (defenseStat?.base_stat || 0)
    }
  }, { hp: 0, attack: 0, defense: 0 })

  return {
    hp: Math.round(totals.hp / favoritePokemon.value.length),
    attack: Math.round(totals.attack / favoritePokemon.value.length),
    defense: Math.round(totals.defense / favoritePokemon.value.length)
  }
})

const typeDistribution = computed(() => {
  const typeCount = {}
  favoritePokemon.value.forEach(pokemon => {
    if (pokemon.types && Array.isArray(pokemon.types)) {
      pokemon.types.forEach(type => {
        if (type && type.type && type.type.name) {
          const typeName = type.type.name
          typeCount[typeName] = (typeCount[typeName] || 0) + 1
        }
      })
    }
  })
  
  return Object.entries(typeCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const generationDistribution = computed(() => {
  const genRanges = {
    1: [1, 151],
    2: [152, 251], 
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1010]
  }
  
  const genCount = {}
  
  favoritePokemon.value.forEach(pokemon => {
    const pokemonId = pokemon.id
    for (const [gen, [min, max]] of Object.entries(genRanges)) {
      if (pokemonId >= min && pokemonId <= max) {
        genCount[gen] = (genCount[gen] || 0) + 1
        break
      }
    }
  })
  
  return Object.entries(genCount)
    .map(([generation, count]) => ({ generation: parseInt(generation), count }))
    .sort((a, b) => a.generation - b.generation)
})

// Helper function to fetch Pokemon data
const fetchPokemonData = async (pokemonId) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon ${pokemonId}: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching Pokemon ${pokemonId}:`, error)
    throw error
  }
}

// Methods
const handleToggleFavorite = async (pokemon) => {
  try {
    await pokemonStore.toggleFavorite(pokemon)
    // Reload favorites to update the display
    await loadFavorites()
  } catch (err) {
    console.error('Error toggling favorite:', err)
    error.value = 'Failed to update favorite status'
    
    // Clear error after 3 seconds
    setTimeout(() => {
      error.value = null
    }, 3000)
  }
}

const clearAllFavorites = async () => {
  if (confirm('Are you sure you want to remove all Pokémon from your favorites? This action cannot be undone.')) {
    try {
      pokemonStore.clearAllFavorites()
      favoritePokemon.value = []
    } catch (err) {
      console.error('Error clearing favorites:', err)
      error.value = 'Failed to clear favorites'
      
      // Clear error after 3 seconds
      setTimeout(() => {
        error.value = null
      }, 3000)
    }
  }
}

const navigateToDetail = (pokemonId) => {
  router.push(`/pokemon/${pokemonId}`)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
}

const retryLoad = async () => {
  error.value = null
  await loadFavorites()
}

const loadFavorites = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Get favorite IDs from store
    const favoriteIds = pokemonStore.favorites || []
    
    if (favoriteIds.length === 0) {
      favoritePokemon.value = []
      return
    }

    // Check if favorites are already objects or just IDs
    if (favoriteIds.length > 0 && typeof favoriteIds[0] === 'object') {
      // Already full objects
      favoritePokemon.value = favoriteIds
      return
    }

    // Fetch full Pokemon data for each favorite ID
    const pokemonPromises = favoriteIds.map(id => fetchPokemonData(id))
    const pokemonData = await Promise.allSettled(pokemonPromises)
    
    // Filter out failed requests and extract successful ones
    favoritePokemon.value = pokemonData
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
    
    // Log any failed requests
    const failedRequests = pokemonData.filter(result => result.status === 'rejected')
    if (failedRequests.length > 0) {
      console.warn(`Failed to load ${failedRequests.length} favorite Pokemon`)
    }
    
  } catch (err) {
    console.error('Error loading favorites:', err)
    error.value = 'Failed to load favorites. Please try again.'
  } finally {
    loading.value = false
  }
}

// Watch for changes in store favorites
watch(favorites, async (newFavorites) => {
  if (newFavorites) {
    await loadFavorites()
  }
}, { immediate: false })

// Clear error when favorites change (successful operations)
watch(favoritePokemon, (newFavorites, oldFavorites) => {
  // Only clear error if favorites actually changed (not just initial load)
  if (oldFavorites && newFavorites.length !== oldFavorites.length && error.value) {
    error.value = null
  }
}, { deep: true })

// Clear search when no results and user is typing
watch([searchQuery, selectedType], () => {
  // Clear any existing errors when user changes filters
  if (error.value) {
    error.value = null
  }
})

// Lifecycle
onMounted(async () => {
  await loadFavorites()
})
</script>

<style scoped>
/* Custom animations for stats */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-card {
  animation: fadeInUp 0.5s ease-out;
}

/* Hover effects for type badges */
.type-badge:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Enhanced card hover effect */
.pokemon-card-hover:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px) scale(1.02);
}
</style>