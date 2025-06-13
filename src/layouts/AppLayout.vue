<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <slot name="navbar" />
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-6">
      <slot />
    </main>

    <!-- Footer (optional) -->
    <footer class="bg-white border-t mt-auto">
      <div class="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
        © 2025 Tevvo. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
