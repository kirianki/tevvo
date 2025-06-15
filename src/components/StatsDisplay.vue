<script setup>
defineProps({
  total: {
    type: Number,
    default: 0
  },
  showing: {
    type: Number,
    default: 0
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <template v-if="isLoading">
      <div class="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
    </template>
    <template v-else>
      <p class="text-sm text-gray-500 mb-1">Showing</p>
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-bold text-gray-800">{{ showing }}</span>
        <span class="text-gray-500">of</span>
        <span class="text-2xl font-bold text-gray-800">{{ total }}</span>
        <span class="text-gray-500">Pokémon</span>
      </div>
    </template>
  </div>
</template>