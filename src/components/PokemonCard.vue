<template>
  <div
    @click="onClick"
    class="cursor-pointer bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
  >
    <div class="flex justify-center items-center h-32">
      <img
        v-if="pokemonData?.sprites?.other?.['official-artwork']?.front_default"
        :src="pokemonData.sprites.other['official-artwork'].front_default"
        :alt="pokemonData.name"
        class="h-24 w-24 object-contain"
      />
      <div v-else class="text-gray-400 text-sm">Loading image...</div>
    </div>
    <h3 class="mt-2 text-center font-semibold capitalize">
      {{ pokemonData.name || 'Unknown' }}
    </h3>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, toRaw, isRef } from 'vue'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  },
  onClick: {
    type: Function,
    default: () => {}
  }
})

const pokemonData = ref({})

// Function to load data only if needed
const loadPokemonData = async (poke) => {
  const rawPoke = isRef(poke) ? toRaw(poke.value) : toRaw(poke)

  if (rawPoke?.sprites) {
    pokemonData.value = rawPoke // already a full Pokémon object
  } else if (rawPoke?.url) {
    try {
      const response = await fetch(rawPoke.url)
      if (!response.ok) throw new Error('Failed to fetch Pokémon')
      pokemonData.value = await response.json()
    } catch (error) {
      console.error('Failed to load Pokémon data:', error)
    }
  } else {
    console.warn('Invalid pokemon prop passed:', rawPoke)
  }
}

// Watch for changes (reactivity-safe)
watch(
  () => props.pokemon,
  (newVal) => {
    loadPokemonData(newVal)
  },
  { immediate: true }
)
</script>
