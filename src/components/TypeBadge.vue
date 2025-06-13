<template>
    <span
      :class="[
        'inline-flex items-center font-medium rounded-full transition-all duration-200',
        sizeClasses,
        'text-white shadow-sm hover:shadow-md',
        `hover:scale-105`
      ]"
      :style="{ backgroundColor: typeColor }"
    >
      <span class="capitalize">{{ type }}</span>
      <span v-if="showCount && count" class="ml-1 opacity-75">
        ({{ count }})
      </span>
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    type: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    count: {
      type: Number,
      default: null
    },
    showCount: {
      type: Boolean,
      default: false
    }
  })
  
  // Pokémon type colors mapping
  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  }
  
  const typeColor = computed(() => {
    return typeColors[props.type.toLowerCase()] || '#68A090'
  })
  
  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'small':
        return 'px-2 py-1 text-xs'
      case 'large':
        return 'px-4 py-2 text-base'
      default:
        return 'px-3 py-1 text-sm'
    }
  })
  </script>
  
  <style scoped>
  /* Custom shadow for better visual appeal */
  .shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  
  .hover\:shadow-md:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  </style>