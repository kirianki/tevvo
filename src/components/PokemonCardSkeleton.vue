<template>
    <div class="pokemon-card-skeleton skeleton-shimmer">
      <div class="skeleton-header">
        <div class="skeleton-favorite"></div>
      </div>
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-id"></div>
        <div class="skeleton-name"></div>
        <div class="skeleton-types">
          <div class="skeleton-type"></div>
          <div class="skeleton-type"></div>
        </div>
        <div class="skeleton-stats">
          <div class="skeleton-stat"></div>
          <div class="skeleton-stat"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PokemonCardSkeleton'
  }
  </script>
  
  <style scoped>
  .pokemon-card-skeleton {
    @apply bg-white rounded-xl shadow-md overflow-hidden;
    height: 380px;
  }
  
  .skeleton-header {
    @apply relative p-4;
  }
  
  .skeleton-favorite {
    @apply absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full;
  }
  
  .skeleton-image {
    @apply w-40 h-40 bg-gray-200 rounded-lg mx-auto my-4;
  }
  
  .skeleton-content {
    @apply p-4 pt-0;
  }
  
  .skeleton-id {
    @apply w-16 h-4 bg-gray-200 rounded mb-1;
  }
  
  .skeleton-name {
    @apply w-32 h-6 bg-gray-200 rounded mb-2;
  }
  
  .skeleton-types {
    @apply flex gap-2 mb-3;
  }
  
  .skeleton-type {
    @apply w-16 h-6 bg-gray-200 rounded-full;
  }
  
  .skeleton-stats {
    @apply flex justify-between;
  }
  
  .skeleton-stat {
    @apply w-16 h-8 bg-gray-200 rounded;
  }
  </style>