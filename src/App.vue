<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const isMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen w-full flex flex-col m-0 p-0 text-gray-800 bg-white">
    <header class="flex items-center justify-between px-4 sm:px-8 py-4 bg-gray-50 border-b border-gray-200 w-full flex-shrink-0 relative">
      <RouterLink to="/" @click="closeMenu">
        <img alt="Vue logo" class="h-10 sm:h-12 w-auto" src="@/assets/main.png" />
      </RouterLink>
      
      <!-- Mobile menu button -->
      <button 
        @click="toggleMenu"
        class="md:hidden flex flex-col justify-center items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <span class="w-6 h-0.5 bg-gray-600 transition-all duration-300" :class="{ 'rotate-45 translate-y-1.5': isMenuOpen }"></span>
        <span class="w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300" :class="{ 'opacity-0': isMenuOpen }"></span>
        <span class="w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300" :class="{ '-rotate-45 -translate-y-1.5': isMenuOpen }"></span>
      </button>
      
      <!-- Desktop navigation -->
      <nav class="hidden md:flex gap-4 items-center">
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

      <!-- Mobile navigation menu -->
      <nav 
        v-show="isMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-gray-50 border-b border-gray-200 shadow-lg z-50 transform transition-all duration-300 ease-in-out"
        :class="{ 'opacity-100 translate-y-0': isMenuOpen, 'opacity-0 -translate-y-2': !isMenuOpen }"
      >
        <div class="flex flex-col py-2">
          <RouterLink 
            to="/dashboard"
            @click="closeMenu"
            class="no-underline text-gray-700 font-medium px-6 py-3 border-b border-gray-100 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
            active-class="text-green-600 font-bold bg-green-50"
          >
            Dashboard
          </RouterLink>
          <RouterLink 
            to="/pokedex"
            @click="closeMenu"
            class="no-underline text-gray-700 font-medium px-6 py-3 border-b border-gray-100 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
            active-class="text-green-600 font-bold bg-green-50"
          >
            Pokedex
          </RouterLink>
          <RouterLink 
            to="/favorites"
            @click="closeMenu"
            class="no-underline text-gray-700 font-medium px-6 py-3 border-b border-gray-100 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
            active-class="text-green-600 font-bold bg-green-50"
          >
            Favorites
          </RouterLink>
          <RouterLink 
            v-if="!isAuthenticated" 
            to="/login"
            @click="closeMenu"
            class="no-underline text-gray-700 font-medium px-6 py-3 border-b border-gray-100 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
            active-class="text-green-600 font-bold bg-green-50"
          >
            Login
          </RouterLink>
          <RouterLink 
            v-if="!isAuthenticated" 
            to="/register"
            @click="closeMenu"
            class="no-underline text-gray-700 font-medium px-6 py-3 border-b border-gray-100 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
            active-class="text-green-600 font-bold bg-green-50"
          >
            Register
          </RouterLink>
          <button 
            v-if="isAuthenticated" 
            @click="authStore.logout(); closeMenu()"
            class="text-left bg-transparent border-none text-red-600 cursor-pointer font-medium px-6 py-3 transition-colors duration-200 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
    
    <main class="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-y-auto">
      <RouterView />
    </main>

    <!-- Mobile menu overlay -->
    <div 
      v-if="isMenuOpen"
      @click="closeMenu"
      class="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
    ></div>
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

/* Prevent body scroll when mobile menu is open */
body.menu-open {
  overflow: hidden;
}

/* Ensure proper touch targets for mobile */
@media (max-width: 768px) {
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
}
</style>
