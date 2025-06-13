<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div class="container mx-auto px-4 max-w-6xl">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
            {{ error }}
          </div>
        </div>
  
        <!-- Pokemon Detail -->
        <div v-else-if="pokemon" class="space-y-8">
          <!-- Navigation -->
          <div class="flex justify-between items-center">
            <button
              @click="$router.go(-1)"
              class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            
            <div class="flex gap-2">
              <button
                v-if="pokemon.id > 1"
                @click="navigateToPokemon(pokemon.id - 1)"
                class="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Previous
              </button>
              <button
                @click="navigateToPokemon(pokemon.id + 1)"
                class="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Next
              </button>
            </div>
          </div>
  
          <!-- Main Content -->
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="relative">
              <!-- Header with Type Background -->
              <div :class="getTypeGradient(pokemon.types[0]?.type.name)" class="px-8 py-12 text-white">
                <div class="flex flex-col md:flex-row items-center gap-8">
                  <!-- Pokemon Image -->
                  <div class="relative">
                    <div class="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <img
                        :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default"
                        :alt="pokemon.name"
                        class="w-56 h-56 object-contain filter drop-shadow-2xl"
                      />
                    </div>
                    <div class="absolute -top-2 -right-2 bg-white/90 rounded-full px-3 py-1 text-gray-800 font-bold">
                      #{{ String(pokemon.id).padStart(3, '0') }}
                    </div>
                  </div>
  
                  <!-- Basic Info -->
                  <div class="text-center md:text-left space-y-4">
                    <h1 class="text-5xl font-bold capitalize">{{ pokemon.name }}</h1>
                    
                    <!-- Type Badges -->
                    <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span
                        v-for="type in pokemon.types"
                        :key="type.type.name"
                        :class="getTypeColor(type.type.name)"
                        class="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
                      >
                        {{ type.type.name }}
                      </span>
                    </div>
  
                    <!-- Physical Stats -->
                    <div class="grid grid-cols-2 gap-4 text-center">
                      <div class="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <div class="text-2xl font-bold">{{ pokemon.height / 10 }}m</div>
                        <div class="text-sm opacity-90">Height</div>
                      </div>
                      <div class="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <div class="text-2xl font-bold">{{ pokemon.weight / 10 }}kg</div>
                        <div class="text-sm opacity-90">Weight</div>
                      </div>
                    </div>
  
                    <!-- Favorite Button -->
                    <button
                      @click="toggleFavorite"
                      :class="[
                        'flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-lg',
                        isFavorite 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-white text-gray-800 hover:bg-gray-100'
                      ]"
                    >
                      <svg class="w-5 h-5" :class="isFavorite ? 'fill-current' : 'fill-none'" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Detailed Information -->
            <div class="p-8 space-y-8">
              <!-- Stats Chart -->
              <div class="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 class="text-2xl font-bold mb-4 text-gray-800">Base Stats</h2>
                  <div class="space-y-3">
                    <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="flex items-center gap-4">
                      <div class="w-20 text-sm font-medium text-gray-600 capitalize">
                        {{ formatStatName(stat.stat.name) }}
                      </div>
                      <div class="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                        <div
                          :class="getStatColor(stat.base_stat)"
                          class="h-full rounded-full transition-all duration-1000 ease-out"
                          :style="{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }"
                        ></div>
                      </div>
                      <div class="w-12 text-sm font-bold text-gray-800">{{ stat.base_stat }}</div>
                    </div>
                  </div>
                  <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div class="text-sm text-gray-600">Total: 
                      <span class="font-bold text-gray-800">{{ totalStats }}</span>
                    </div>
                  </div>
                </div>
  
                <!-- Abilities -->
                <div>
                  <h2 class="text-2xl font-bold mb-4 text-gray-800">Abilities</h2>
                  <div class="space-y-3">
                    <div
                      v-for="ability in pokemon.abilities"
                      :key="ability.ability.name"
                      class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500"
                    >
                      <div class="font-semibold text-gray-800 capitalize mb-1">
                        {{ ability.ability.name.replace('-', ' ') }}
                        <span v-if="ability.is_hidden" class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                          Hidden
                        </span>
                      </div>
                      <div class="text-sm text-gray-600">
                        {{ getAbilityDescription(ability.ability.name) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Evolution Chain -->
              <div v-if="evolutionChain.length > 1">
                <h2 class="text-2xl font-bold mb-4 text-gray-800">Evolution Chain</h2>
                <div class="flex flex-wrap items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div
                    v-for="(evolution, index) in evolutionChain"
                    :key="evolution.id"
                    class="flex items-center gap-4"
                  >
                    <div
                      :class="[
                        'text-center p-4 rounded-lg transition-all cursor-pointer',
                        evolution.id === pokemon.id 
                          ? 'bg-blue-500 text-white transform scale-105 shadow-lg' 
                          : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg'
                      ]"
                      @click="navigateToPokemon(evolution.id)"
                    >
                      <img
                        :src="evolution.image"
                        :alt="evolution.name"
                        class="w-20 h-20 mx-auto mb-2"
                      />
                      <div class="font-semibold capitalize text-sm">{{ evolution.name }}</div>
                    </div>
                    
                    <div v-if="index < evolutionChain.length - 1" class="text-2xl text-gray-400">
                      →
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Additional Sprites -->
              <div>
                <h2 class="text-2xl font-bold mb-4 text-gray-800">Sprites</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    v-for="(sprite, name) in getSprites()"
                    :key="name"
                    class="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
                  >
                    <img :src="sprite" :alt="name" class="w-24 h-24 mx-auto mb-2" />
                    <div class="text-xs text-gray-600 capitalize">{{ name.replace('_', ' ') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PokemonDetail',
    data() {
      return {
        pokemon: null,
        evolutionChain: [],
        loading: true,
        error: null,
        favorites: JSON.parse(localStorage.getItem('pokemonFavorites') || '[]')
      }
    },
    computed: {
      isFavorite() {
        return this.pokemon && this.favorites.includes(this.pokemon.id)
      },
      totalStats() {
        return this.pokemon?.stats.reduce((total, stat) => total + stat.base_stat, 0) || 0
      }
    },
    async mounted() {
      await this.fetchPokemon()
    },
    watch: {
      '$route'() {
        this.fetchPokemon()
      }
    },
    methods: {
      async fetchPokemon() {
        this.loading = true
        this.error = null
        
        try {
          const id = this.$route.params.id
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          
          if (!response.ok) {
            throw new Error('Pokemon not found')
          }
          
          this.pokemon = await response.json()
          await this.fetchEvolutionChain()
        } catch (err) {
          this.error = err.message
        } finally {
          this.loading = false
        }
      },
  
      async fetchEvolutionChain() {
        try {
          const speciesResponse = await fetch(this.pokemon.species.url)
          const speciesData = await speciesResponse.json()
          
          const evolutionResponse = await fetch(speciesData.evolution_chain.url)
          const evolutionData = await evolutionResponse.json()
          
          this.evolutionChain = await this.parseEvolutionChain(evolutionData.chain)
        } catch (err) {
          console.error('Failed to fetch evolution chain:', err)
          this.evolutionChain = []
        }
      },
  
      async parseEvolutionChain(chain) {
        const evolutions = []
        let current = chain
  
        while (current) {
          const pokemonId = current.species.url.split('/').slice(-2, -1)[0]
          const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
          const pokemonData = await pokemonResponse.json()
  
          evolutions.push({
            id: parseInt(pokemonId),
            name: current.species.name,
            image: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default
          })
  
          current = current.evolves_to[0] || null
        }
  
        return evolutions
      },
  
      toggleFavorite() {
        if (!this.pokemon) return
  
        const index = this.favorites.indexOf(this.pokemon.id)
        if (index > -1) {
          this.favorites.splice(index, 1)
        } else {
          this.favorites.push(this.pokemon.id)
        }
        
        localStorage.setItem('pokemonFavorites', JSON.stringify(this.favorites))
      },
  
      navigateToPokemon(id) {
        this.$router.push(`/pokemon/${id}`)
      },
  
      getTypeGradient(type) {
        const gradients = {
          normal: 'bg-gradient-to-br from-gray-400 to-gray-600',
          fire: 'bg-gradient-to-br from-red-500 to-orange-600',
          water: 'bg-gradient-to-br from-blue-500 to-blue-700',
          electric: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
          grass: 'bg-gradient-to-br from-green-400 to-green-600',
          ice: 'bg-gradient-to-br from-blue-300 to-cyan-500',
          fighting: 'bg-gradient-to-br from-red-700 to-red-800',
          poison: 'bg-gradient-to-br from-purple-500 to-purple-700',
          ground: 'bg-gradient-to-br from-yellow-600 to-yellow-800',
          flying: 'bg-gradient-to-br from-indigo-400 to-blue-500',
          psychic: 'bg-gradient-to-br from-pink-500 to-purple-600',
          bug: 'bg-gradient-to-br from-green-500 to-yellow-500',
          rock: 'bg-gradient-to-br from-yellow-800 to-gray-700',
          ghost: 'bg-gradient-to-br from-purple-700 to-indigo-800',
          dragon: 'bg-gradient-to-br from-indigo-700 to-purple-800',
          dark: 'bg-gradient-to-br from-gray-800 to-black',
          steel: 'bg-gradient-to-br from-gray-500 to-gray-700',
          fairy: 'bg-gradient-to-br from-pink-400 to-pink-600'
        }
        return gradients[type] || gradients.normal
      },
  
      getTypeColor(type) {
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
      },
  
      getStatColor(value) {
        if (value >= 120) return 'bg-red-500'
        if (value >= 100) return 'bg-orange-500'
        if (value >= 80) return 'bg-yellow-500'
        if (value >= 60) return 'bg-green-500'
        if (value >= 40) return 'bg-blue-500'
        return 'bg-gray-400'
      },
  
      formatStatName(name) {
        const nameMap = {
          'hp': 'HP',
          'attack': 'Attack',
          'defense': 'Defense',
          'special-attack': 'Sp. Atk',
          'special-defense': 'Sp. Def',
          'speed': 'Speed'
        }
        return nameMap[name] || name
      },
  
      getAbilityDescription(abilityName) {
        // Simplified ability descriptions - in a real app, you'd fetch from the API
        const descriptions = {
          'overgrow': 'Powers up Grass-type moves when HP is low.',
          'chlorophyll': 'Boosts Speed in sunny weather.',
          'blaze': 'Powers up Fire-type moves when HP is low.',
          'solar-power': 'Boosts Sp. Atk in sunny weather but loses HP.',
          'torrent': 'Powers up Water-type moves when HP is low.',
          'rain-dish': 'Gradually recovers HP in rain.',
          'shield-dust': 'Blocks the additional effects of attacks.',
          'run-away': 'Enables sure getaway from wild Pokémon.',
          'keen-eye': 'Prevents accuracy reduction.',
          'tangled-feet': 'Raises evasion when confused.',
          'big-pecks': 'Protects from Defense-lowering attacks.'
        }
        return descriptions[abilityName] || 'A unique ability of this Pokémon.'
      },
  
      getSprites() {
        if (!this.pokemon) return {}
        
        const sprites = {}
        const spriteData = this.pokemon.sprites
        
        if (spriteData.front_default) sprites.front_default = spriteData.front_default
        if (spriteData.back_default) sprites.back_default = spriteData.back_default
        if (spriteData.front_shiny) sprites.front_shiny = spriteData.front_shiny
        if (spriteData.back_shiny) sprites.back_shiny = spriteData.back_shiny
        
        return sprites
      }
    }
  }
  </script>