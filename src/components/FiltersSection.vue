<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const typeOptions = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

const generationOptions = [
  { value: 1, label: 'Generation I' },
  { value: 2, label: 'Generation II' },
  { value: 3, label: 'Generation III' },
  { value: 4, label: 'Generation IV' },
  { value: 5, label: 'Generation V' },
  { value: 6, label: 'Generation VI' },
  { value: 7, label: 'Generation VII' },
  { value: 8, label: 'Generation VIII' }
]

const sortOptions = [
  { value: 'id', label: 'Number' },
  { value: 'name', label: 'Name' },
  { value: 'height', label: 'Height' },
  { value: 'weight', label: 'Weight' }
]

function updateFilter(key, value) {
  emit('update:modelValue', { ...modelValue, [key]: value })
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Type Filter -->
      <div>
        <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select
          id="type-filter"
          :value="modelValue.type"
          @change="updateFilter('type', $event.target.value)"
          :disabled="disabled"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option v-for="type in typeOptions" :key="type" :value="type" class="capitalize">
            {{ type }}
          </option>
        </select>
      </div>

      <!-- Generation Filter -->
      <div>
        <label for="generation-filter" class="block text-sm font-medium text-gray-700 mb-2">Generation</label>
        <select
          id="generation-filter"
          :value="modelValue.generation"
          @change="updateFilter('generation', $event.target.value)"
          :disabled="disabled"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Generations</option>
          <option v-for="gen in generationOptions" :key="gen.value" :value="gen.value">
            {{ gen.label }}
          </option>
        </select>
      </div>

      <!-- Sort By -->
      <div>
        <label for="sort-filter" class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          id="sort-filter"
          :value="modelValue.sort"
          @change="updateFilter('sort', $event.target.value)"
          :disabled="disabled"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Favorites Only Toggle -->
      <div class="flex items-end">
        <label class="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            :checked="modelValue.favoritesOnly"
            @change="updateFilter('favoritesOnly', $event.target.checked)"
            :disabled="disabled"
            class="sr-only peer"
          >
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span class="ms-3 text-sm font-medium text-gray-700">Favorites Only</span>
        </label>
      </div>
    </div>
  </div>
</template>