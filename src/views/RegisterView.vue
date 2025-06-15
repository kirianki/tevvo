<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p class="mt-2 text-gray-600">
              {{ favoritePokemons.length }} Pokémon in your collection
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="clearAllFavorites"
              v-if="favoritePokemons.length > 0"
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
        v-else-if="favoritePokemons.length === 0"
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
            :key="pokemon.id"
            :pokemon="pokemon"
            :is-favorite="true"
            @toggle-favorite="handleToggleFavorite"
            @click="navigateToDetail(pokemon.id)"
            class="transform hover:scale-105 transition-transform duration-200 cursor-pointer"
          />
        </div>

        <!-- No results message -->
        <div v-if="filteredFavorites.length === 0" class="text-center py-8">
          <p class="text-gray-500">No Pokémon match your search criteria.</p>
          <button 
            @click="clearFilters" 
            class="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            Clear filters
          </button>
        </div>

        <!-- Stats Section -->
        <div v-if="filteredFavorites.length > 0" class="mt-12 bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Collection Stats</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">{{ favoritePokemons.length }}</div>
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
const favoritePokemons = ref([])

// Computed properties
const favoriteIds = computed(() => pokemonStore.favorites || [])

const uniqueTypes = computed(() => {
  const types = new Set()
  favoritePokemons.value.forEach(pokemon => {
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
  let filtered = favoritePokemons.value

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
  if (favoritePokemons.value.length === 0) return { hp: 0, attack: 0, defense: 0 }
  
  const totals = favoritePokemons.value.reduce((acc, pokemon) => {
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
    hp: Math.round(totals.hp / favoritePokemons.value.length),
    attack: Math.round(totals.attack / favoritePokemons.value.length),
    defense: Math.round(totals.defense / favoritePokemons.value.length)
  }
})

const typeDistribution = computed(() => {
  const typeCount = {}
  favoritePokemons.value.forEach(pokemon => {
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

// Methods
const handleToggleFavorite = async (pokemon) => {
  try {
    await pokemonStore.toggleFavorite(pokemon)
    await loadFavorites() // Refresh the list after toggling
  } catch (err) {
    console.error('Error toggling favorite:', err)
    error.value = 'Failed to update favorite status'
  }
}

const clearAllFavorites = async () => {
  if (confirm('Are you sure you want to remove all Pokémon from your favorites?')) {
    try {
      await pokemonStore.clearAllFavorites()
      favoritePokemons.value = []
    } catch (err) {
      console.error('Error clearing favorites:', err)
      error.value = 'Failed to clear favorites'
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
    // Fetch details for each favorite Pokemon
    const pokemonPromises = favoriteIds.value.map(id => 
      pokemonStore.fetchPokemonById(id).catch(err => {
        console.error(`Failed to fetch Pokemon ${id}:`, err)
        return null
      })
    )
    
    const results = await Promise.all(pokemonPromises)
    favoritePokemons.value = results.filter(pokemon => pokemon !== null)
    
    if (favoritePokemons.value.length !== favoriteIds.value.length) {
      console.warn('Some favorites failed to load')
    }
  } catch (err) {
    console.error('Error loading favorites:', err)
    error.value = 'Failed to load favorites. Please try again.'
  } finally {
    loading.value = false
  }
}

// Watch for changes in favorite IDs
watch(favoriteIds, async (newIds) => {
  if (newIds.length !== favoritePokemons.value.length) {
    await loadFavorites()
  }
})

// Lifecycle
onMounted(async () => {
  await loadFavorites()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>