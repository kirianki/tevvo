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
    <h3 class="mt-2 text-center font-semibold capitalize">{{ pokemonData.name }}</h3>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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

onMounted(async () => {
  try {
    const res = await fetch(props.pokemon.url)
    pokemonData.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch Pokémon details:', err)
  }
})
</script>
