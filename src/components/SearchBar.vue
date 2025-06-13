<template>
    <div class="relative max-w-md mx-auto">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search Pokémon..."
        class="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="handleSearch"
      />
      <div class="absolute right-3 top-2.5 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { debounce } from 'lodash-es'
  
  const searchQuery = ref('')
  const emit = defineEmits(['search'])
  
  const handleSearch = debounce(() => {
    emit('search', searchQuery.value)
  }, 300)
  </script>