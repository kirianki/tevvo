<template>
    <div :class="containerClasses">
      <div class="relative">
        <!-- Spinner Circle -->
        <div
          :class="[
            'animate-spin rounded-full border-solid',
            sizeClasses,
            colorClasses
          ]"
        ></div>
        
        <!-- Optional Pokeball Icon -->
        <div
          v-if="variant === 'pokeball'"
          :class="[
            'absolute inset-0 flex items-center justify-center',
            iconSizeClasses
          ]"
        >
          <div class="relative">
            <!-- Pokeball top half -->
            <div :class="[
              'rounded-full bg-red-500 border-2 border-black',
              pokeballSizeClasses
            ]" style="border-bottom-color: black;"></div>
            <!-- Pokeball bottom half -->
            <div :class="[
              'rounded-full bg-white border-2 border-black -mt-1',
              pokeballSizeClasses
            ]" style="border-top-color: black;"></div>
            <!-- Center circle -->
            <div :class="[
              'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
              'bg-white rounded-full border-2 border-black',
              centerCircleClasses
            ]"></div>
          </div>
        </div>
      </div>
      
      <!-- Loading Text -->
      <div v-if="text" :class="['mt-3 font-medium', textColorClasses, textSizeClasses]">
        {{ text }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large', 'extra-large'].includes(value)
    },
    color: {
      type: String,
      default: 'blue',
      validator: value => ['blue', 'red', 'green', 'purple', 'gray'].includes(value)
    },
    variant: {
      type: String,
      default: 'spinner',
      validator: value => ['spinner', 'pokeball'].includes(value)
    },
    text: {
      type: String,
      default: ''
    },
    center: {
      type: Boolean,
      default: true
    }
  })
  
  const containerClasses = computed(() => [
    'flex flex-col items-center',
    props.center ? 'justify-center' : ''
  ])
  
  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'small':
        return 'w-4 h-4 border-2'
      case 'large':
        return 'w-12 h-12 border-4'
      case 'extra-large':
        return 'w-16 h-16 border-4'
      default:
        return 'w-8 h-8 border-3'
    }
  })
  
  const colorClasses = computed(() => {
    const colors = {
      blue: 'border-blue-600 border-t-transparent',
      red: 'border-red-600 border-t-transparent',
      green: 'border-green-600 border-t-transparent',
      purple: 'border-purple-600 border-t-transparent',
      gray: 'border-gray-600 border-t-transparent'
    }
    return colors[props.color] || colors.blue
  })
  
  const textColorClasses = computed(() => {
    const colors = {
      blue: 'text-blue-600',
      red: 'text-red-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      gray: 'text-gray-600'
    }
    return colors[props.color] || colors.blue
  })
  
  const textSizeClasses = computed(() => {
    switch (props.size) {
      case 'small':
        return 'text-xs'
      case 'large':
        return 'text-lg'
      case 'extra-large':
        return 'text-xl'
      default:
        return 'text-sm'
    }
  })
  
  const iconSizeClasses = computed(() => {
    switch (props.size) {
      case 'small':
        return 'w-3 h-3'
      case 'large':
        return 'w-8 h-8'
      case 'extra-large':
        return 'w-12 h-12'
      default:
        return 'w-6 h-6'
    }
  })
  
  const pokeballSizeClasses = computed(() => {
    switch (props.size) {
      case 'small':
        return 'w-2 h-1'
      case 'large':
        return 'w-6 h-3'
      case 'extra-large':
        return 'w-8 h-4'
      default:
        return 'w-4 h-2'
    }
  })
  
  const centerCircleClasses = computed(() => {
    switch (props.size) {
      case 'small':
        return 'w-1 h-1'
      case 'large':
        return 'w-2 h-2'
      case 'extra-large':
        return 'w-3 h-3'
      default:
        return 'w-1.5 h-1.5'
    }
  })
  </script>
  
  <style scoped>
  /* Custom border width for medium size */
  .border-3 {
    border-width: 3px;
  }
  
  /* Smooth animation */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  </style>