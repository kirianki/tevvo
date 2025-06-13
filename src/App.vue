<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <div class="min-h-screen w-full flex flex-col m-0 p-0 text-gray-800 bg-white">
    <header class="flex items-center justify-between px-8 py-4 bg-gray-50 border-b border-gray-200 w-full flex-shrink-0">
      <RouterLink to="/">
        <img alt="Vue logo" class="h-12 w-auto" src="@/assets/main.png" />
      </RouterLink>
      
      <nav class="flex gap-4 items-center">
        <RouterLink 
          to="/dashboard"
          class="no-underline text-gray-700 font-medium px-4 py-2 rounded transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
          active-class="text-green-600 font-bold bg-green-50"
        >
          Dashboard
        </RouterLink>
        <RouterLink 
          to="/pokedex"
          class="no-underline text-gray-700 font-medium px-4 py-2 rounded transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
          active-class="text-green-600 font-bold bg-green-50"
        >
          Pokedex
        </RouterLink>
        <RouterLink 
          to="/favorites"
          class="no-underline text-gray-700 font-medium px-4 py-2 rounded transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
          active-class="text-green-600 font-bold bg-green-50"
        >
          Favorites
        </RouterLink>
        <RouterLink 
          v-if="!isAuthenticated" 
          to="/login"
          class="no-underline text-gray-700 font-medium px-4 py-2 rounded transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
          active-class="text-green-600 font-bold bg-green-50"
        >
          Login
        </RouterLink>
        <RouterLink 
          v-if="!isAuthenticated" 
          to="/register"
          class="no-underline text-gray-700 font-medium px-4 py-2 rounded transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
          active-class="text-green-600 font-bold bg-green-50"
        >
          Register
        </RouterLink>
        <button 
          v-if="isAuthenticated" 
          @click="authStore.logout"
          class="bg-transparent border-none text-red-600 cursor-pointer font-medium px-4 py-2 rounded transition-colors duration-200 hover:bg-red-50"
        >
          Logout
        </button>
      </nav>
    </header>
    
    <main class="flex-1 p-8 w-full overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Override main.css styles to allow full screen */
body {
  display: block !important;
  place-items: unset !important;
}

#app {
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  grid-template-columns: none !important;
}
</style>