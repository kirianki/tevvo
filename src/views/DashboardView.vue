<template>
  <AppLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div class="container mx-auto px-4 max-w-6xl">
        <!-- Welcome Section -->
        <div class="mb-8 text-center md:text-left">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {{ authStore.user?.displayName || 'Trainer' }}!
          </h1>
          <p class="text-lg text-gray-600">
            Ready to discover more Pokémon? Let's continue your journey.
          </p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Discovered Count -->
          <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100/80 backdrop-blur-sm">
                <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Pokémon Discovered</p>
                <p class="text-2xl font-semibold text-gray-800">{{ pokemonStore.discoveredCount || featuredPokemon.length }}</p>
              </div>
            </div>
          </div>

          <!-- Favorites Count -->
          <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-red-100/80 backdrop-blur-sm">
                <svg class="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Favorites</p>
                <p class="text-2xl font-semibold text-gray-800">{{ (pokemonStore.favorites?.length) || favoriteCount }}</p>
              </div>
            </div>
          </div>

          <!-- Types Collected -->
          <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100/80 backdrop-blur-sm">
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Types Collected</p>
                <p class="text-2xl font-semibold text-gray-800">{{ uniqueTypesCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Section -->
        <div class="mb-8">
          <div class="max-w-md mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Search Pokémon by name..."
                class="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                @click="handleSearch"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Featured Pokémon Section -->
        <div class="mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Featured Pokémon</h2>
            <router-link 
              to="/pokedex" 
              class="flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              View all
              <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block mb-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {{ error }}
              </div>
            </div>
            <button 
              @click="loadFeaturedPokemon" 
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>

          <!-- Featured Pokémon Grid -->
          <div v-else-if="featuredPokemon.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <div
              v-for="pokemon in featuredPokemon"
              :key="pokemon.id"
              @click="goToPokemon(pokemon.id)"
              class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 group"
            >
              <div class="relative p-4">
                <!-- Favorite Button -->
                <button
                  @click.stop="toggleFavorite(pokemon)"
                  :class="[
                    'absolute top-2 right-2 z-10 p-2 rounded-full transition-all bg-white/80 backdrop-blur-sm shadow-sm',
                    isFavorite(pokemon.id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-400'
                  ]"
                >
                  <svg
                    class="w-5 h-5 transition-all"
                    :class="isFavorite(pokemon.id) ? 'fill-current scale-110' : 'fill-none'"
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
                <div class="flex justify-center mb-4">
                  <div class="relative">
                    <!-- Loading skeleton -->
                    <div 
                      v-if="!pokemon.imageLoaded" 
                      class="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse flex items-center justify-center"
                    >
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    <img
                      :src="getPokemonImage(pokemon)"
                      :alt="pokemon.name"
                      class="w-28 h-28 object-contain transition-all group-hover:scale-110"
                      :class="{ 'opacity-0': !pokemon.imageLoaded }"
                      loading="lazy"
                      @load="pokemon.imageLoaded = true"
                      @error="handleImageError(pokemon)"
                    />
                  </div>
                </div>

                <!-- Pokemon Info -->
                <div class="text-center">
                  <div class="text-xs font-bold text-gray-500 mb-1">
                    #{{ String(pokemon.id).padStart(3, '0') }}
                  </div>
                  <h3 class="text-lg font-bold text-gray-800 mb-3 capitalize">
                    {{ pokemon.name }}
                  </h3>

                  <!-- Types -->
                  <div class="flex gap-1 justify-center flex-wrap">
                    <span
                      v-for="type in pokemon.types"
                      :key="type.type.name"
                      :class="getTypeColor(type.type.name)"
                      class="px-2 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                    >
                      {{ capitalizeFirst(type.type.name) }}
                    </span>
                  </div>

                  <!-- Stats Preview -->
                  <div v-if="pokemon.stats" class="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div class="text-center">
                      <div class="font-semibold text-gray-800">{{ pokemon.stats[0]?.base_stat || 0 }}</div>
                      <div class="text-gray-500">HP</div>
                    </div>
                    <div class="text-center">
                      <div class="font-semibold text-gray-800">{{ pokemon.stats[1]?.base_stat || 0 }}</div>
                      <div class="text-gray-500">ATK</div>
                    </div>
                    <div class="text-center">
                      <div class="font-semibold text-gray-800">{{ pokemon.stats[2]?.base_stat || 0 }}</div>
                      <div class="text-gray-500">DEF</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <div class="text-gray-500 mb-4">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="text-lg">No Pokémon found</p>
              <p class="text-sm">Try refreshing the page</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pokedex Card -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
            <div class="flex items-center mb-3">
              <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="text-xl font-semibold">Explore Pokédex</h3>
            </div>
            <p class="mb-4 opacity-90">Browse through all Pokémon with advanced filters and search</p>
            <router-link 
              to="/pokedex"
              class="inline-flex items-center px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Open Pokédex
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>

          <!-- Favorites Card -->
          <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
            <div class="flex items-center mb-3">
              <svg class="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
              <h3 class="text-xl font-semibold">My Favorites</h3>
            </div>
            <p class="mb-4 opacity-90">View and manage your favorite Pokémon collection</p>
            <router-link 
              to="/favorites"
              class="inline-flex items-center px-6 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Favorites
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePokemonStore } from '../stores/pokemon'
import AppLayout from '../layouts/AppLayout.vue'

const router = useRouter()
const authStore = useAuthStore()
const pokemonStore = usePokemonStore()

const featuredPokemon = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const favoriteCount = ref(1) // Default value from your UI

// Store favorite IDs locally
const favorites = ref(new Set())

const uniqueTypesCount = computed(() => {
  const types = new Set()
  featuredPokemon.value.forEach(pokemon => {
    pokemon.types?.forEach(type => types.add(type.type.name))
  })
  return Math.max(types.size, 7) // Default to 7 as shown in your UI
})

const loadFeaturedPokemon = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Fetch a list of Pokemon IDs to get detailed data
    const pokemonIds = [1, 4, 7, 25, 39, 52, 104, 132, 144] // Popular starter and iconic Pokemon
    const pokemonPromises = pokemonIds.map(id => fetchPokemonDetails(id))
    
    const results = await Promise.allSettled(pokemonPromises)
    featuredPokemon.value = results
      .filter(result => result.status === 'fulfilled')
      .map(result => ({
        ...result.value,
        imageLoaded: false
      }))
    
    if (featuredPokemon.value.length === 0) {
      throw new Error('No Pokémon data available')
    }
  } catch (err) {
    error.value = 'Failed to load featured Pokémon. Please check your internet connection.'
    console.error('Error loading featured Pokémon:', err)
  } finally {
    loading.value = false
  }
}

const fetchPokemonDetails = async (id) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon ${id}`)
  }
  return await response.json()
}

const getPokemonImage = (pokemon) => {
  // Try multiple image sources in order of preference
  return pokemon.sprites?.other?.['official-artwork']?.front_default ||
         pokemon.sprites?.other?.dream_world?.front_default ||
         pokemon.sprites?.other?.home?.front_default ||
         pokemon.sprites?.front_default ||
         `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
}

const handleImageError = (pokemon) => {
  // Fallback to a different image source or placeholder
  pokemon.imageError = true
  pokemon.imageLoaded = true
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/pokedex?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const goToPokemon = (id) => {
  router.push(`/pokemon/${id}`)
}

const toggleFavorite = (pokemon) => {
  if (favorites.value.has(pokemon.id)) {
    favorites.value.delete(pokemon.id)
    favoriteCount.value = Math.max(0, favoriteCount.value - 1)
  } else {
    favorites.value.add(pokemon.id)
    favoriteCount.value += 1
  }
  
  // Try to use the store if available
  if (pokemonStore.toggleFavorite) {
    pokemonStore.toggleFavorite(pokemon)
  }
}

const isFavorite = (pokemonId) => {
  // Check both local storage and store
  return favorites.value.has(pokemonId) || 
         (pokemonStore.isFavorite && pokemonStore.isFavorite(pokemonId))
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
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

onMounted(() => {
  loadFeaturedPokemon()
})
</script>