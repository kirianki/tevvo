<template>
    <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block mb-4">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ message }}</span>
      </div>
    </div>
    <br>
    <button
      @click="$emit('retry')"
      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Try Again
    </button>
  </template>
  
  <script setup>
  defineProps({
    message: { type: String, required: true }
  })
  
  defineEmits(['retry'])
  </script>