<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Pokédex</h1>
        <p class="text-lg text-gray-600">Discover and explore the world of Pokémon</p>
      </div>

      <!-- Search and Filters Section -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center mb-4">
          <!-- Search Input -->
          <div class="relative flex-1 w-full">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search Pokémon by name..."
              class="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap gap-2 w-full md:w-auto">
            <select
              v-model="selectedType"
              @change="applyFilters"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option v-for="type in types" :key="type" :value="type">
                {{ capitalizeFirst(type) }}
              </option>
            </select>

            <select
              v-model="selectedGeneration"
              @change="applyFilters"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Generations</option>
              <option v-for="gen in 9" :key="gen" :value="gen.toString()">
                Generation {{ gen }}
              </option>
            </select>

            <select
              v-model="sortBy"
              @change="applySorting"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="id">Sort by ID</option>
              <option value="name">Sort by Name (A-Z)</option>
              <option value="name-desc">Sort by Name (Z-A)</option>
              <option value="type">Sort by Type</option>
            </select>

            <button
              @click="showFavoritesOnly = !showFavoritesOnly"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                showFavoritesOnly
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
              ]"
            >
              <svg
                class="w-5 h-5"
                :class="showFavoritesOnly ? 'fill-current' : 'fill-none'"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {{ showFavoritesOnly ? 'Show All' : 'Favorites Only' }}
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex justify-center gap-6 text-center">
          <div>
            <div class="text-sm text-gray-600">Total Pokémon</div>
            <div class="text-xl font-bold text-gray-800">{{ totalCount }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Showing</div>
            <div class="text-xl font-bold text-gray-800">{{ displayedPokemon.length }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Favorites</div>
            <div class="text-xl font-bold text-gray-800">{{ favorites.length }}</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && displayedPokemon.length === 0" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="text-center py-16">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
          {{ error }}
        </div>
        <button
          @click="retryFetch"
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Pokemon Grid -->
      <div v-else-if="!isLoading && displayedPokemon.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="pokemon in displayedPokemon"
          :key="pokemon.id"
          @click="viewPokemonDetails(pokemon.id)"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
        >
          <div class="relative p-4">
            <!-- Favorite Button -->
            <button
              @click.stop="toggleFavorite(pokemon.id)"
              :class="[
                'absolute top-4 right-4 z-10 p-2 rounded-full transition-colors',
                isFavorite(pokemon.id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              <svg
                class="w-6 h-6"
                :class="isFavorite(pokemon.id) ? 'fill-current' : 'fill-none'"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            <!-- Pokemon Image -->
            <div class="flex justify-center">
              <img
                :src="pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default"
                :alt="pokemon.name"
                class="w-40 h-40 object-contain"
                loading="lazy"
              />
            </div>

            <!-- Pokemon Info -->
            <div class="p-4 pt-0">
              <div class="text-xs font-bold text-gray-500 mb-1">
                #{{ pokemon.id.toString().padStart(3, '0') }}
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2 capitalize">
                {{ pokemon.name }}
              </h3>

              <!-- Types -->
              <div class="flex gap-2 mb-3">
                <span
                  v-for="type in pokemon.types"
                  :key="type.type.name"
                  :class="getTypeColor(type.type.name)"
                  class="px-3 py-1 rounded-full text-xs font-semibold text-white shadow"
                >
                  {{ capitalizeFirst(type.type.name) }}
                </span>
              </div>

              <!-- Stats -->
              <div class="flex justify-between text-sm text-gray-600">
                <div>
                  <div class="font-medium">Height</div>
                  <div class="text-gray-800 font-bold">{{ (pokemon.height / 10).toFixed(1) }}m</div>
                </div>
                <div>
                  <div class="font-medium">Weight</div>
                  <div class="text-gray-800 font-bold">{{ (pokemon.weight / 10).toFixed(1) }}kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="!isLoading && displayedPokemon.length === 0 && !hasError"
        class="text-center py-16 bg-white rounded-xl shadow-md"
      >
        <p class="text-lg text-gray-600 mb-4">No Pokémon found matching your criteria.</p>
        <button
          @click="clearAllFilters"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <!-- Load More -->
      <div v-if="canLoadMore" class="mt-8 text-center">
        <button
          @click="loadMore"
          :disabled="isLoading"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-colors',
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          ]"
        >
          <span v-if="!isLoading">Load More Pokémon</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '../stores/pokemon'

const router = useRouter()
const pokemonStore = usePokemonStore()

// Reactive data
const searchQuery = ref('')
const selectedType = ref('')
const selectedGeneration = ref('')
const sortBy = ref('id')
const showFavoritesOnly = ref(false)
const searchResults = ref([])

// Computed properties
const {
  pokemonList,
  favorites,
  isLoading,
  hasError,
  error,
  types,
  totalCount,
  toggleFavorite,
  isFavorite,
  fetchPokemonList,
  loadMorePokemon,
  fetchTypes,
  clearError
} = pokemonStore

const displayedPokemon = computed(() => {
  // Start with either search results or full list
  let result = searchQuery.value ? searchResults.value : [...pokemonList]

  // Apply filters in sequence
  if (showFavoritesOnly.value) {
    result = result.filter(pokemon => isFavorite(pokemon.id))
  }

  if (selectedType.value) {
    result = result.filter(pokemon => 
      pokemon.types.some(type => type.type.name === selectedType.value)
    )
  }

  if (selectedGeneration.value) {
    // Note: This assumes you have generation data in your pokemon objects
    // You might need to implement this differently based on your API
    result = result.filter(pokemon => 
      pokemon.generation === selectedGeneration.value
    )
  }

  // Apply sorting
  return sortPokemon(result)
})

const canLoadMore = computed(() => {
  return !searchQuery.value && pokemonList.length < totalCount && pokemonList.length > 0
})

// Methods
const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    // Simple client-side search - replace with API search if needed
    const query = searchQuery.value.toLowerCase()
    searchResults.value = pokemonList.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query)
    )
  } catch (err) {
    console.error('Search error:', err)
    searchResults.value = []
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const sortPokemon = (pokemonArray) => {
  if (!pokemonArray) return []
  
  const sorted = [...pokemonArray]
  switch (sortBy.value) {
    case 'id':
      return sorted.sort((a, b) => a.id - b.id)
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'type':
      return sorted.sort((a, b) => {
        const typeA = a.types[0]?.type.name || ''
        const typeB = b.types[0]?.type.name || ''
        return typeA.localeCompare(typeB)
      })
    default:
      return sorted
  }
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedGeneration.value = ''
  sortBy.value = 'id'
  showFavoritesOnly.value = false
  searchResults.value = []
}

const viewPokemonDetails = (pokemonId) => {
  router.push(`/pokemon/${pokemonId}`)
}

const loadMore = async () => {
  try {
    await loadMorePokemon()
  } catch (err) {
    console.error('Error loading more Pokemon:', err)
  }
}

const retryFetch = async () => {
  clearError()
  await initializeData()
}

const initializeData = async () => {
  try {
    await fetchTypes()
    await fetchPokemonList()
  } catch (err) {
    console.error('Error initializing data:', err)
  }
}

const getTypeColor = (type) => {
  const colors = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-400'
  }
  return colors[type] || colors.normal
}

// Lifecycle
onMounted(() => {
  initializeData()
})

// Watchers
watch([sortBy, selectedType, selectedGeneration, showFavoritesOnly], () => {
  // These changes are handled by the computed property
})
</script>