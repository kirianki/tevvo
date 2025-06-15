<script setup>
defineProps({
  columns: {
    type: Number,
    default: 3
  }
})
</script>

<template>
  <div 
    class="grid gap-6"
    :style="{ 'grid-template-columns': `repeat(${columns}, minmax(0, 1fr))` }"
  >
    <div v-for="i in columns * 2" :key="i" class="bg-white rounded-xl shadow overflow-hidden">
      <div class="h-48 bg-gray-200 animate-pulse"></div>
      <div class="p-4">
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div class="flex gap-2">
          <div class="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
          <div class="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>