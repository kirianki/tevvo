<template>
  <div class="text-center py-12">
    <!-- Icon -->
    <div class="mx-auto w-24 h-24 mb-6 flex items-center justify-center">
      <component
        :is="iconComponent"
        :class="[
          'w-16 h-16 stroke-1',
          iconColor
        ]"
      />
    </div>

    <!-- Title -->
    <h3 class="text-xl font-semibold text-gray-900 mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-gray-600 mb-8 max-w-md mx-auto">
      {{ description }}
    </p>

    <!-- Action Button/Link -->
    <div v-if="action">
      <router-link
        v-if="action.to"
        :to="action.to"
        :class="actionClasses"
      >
        <component
          v-if="action.icon"
          :is="getIconComponent(action.icon)"
          class="w-5 h-5 mr-2"
        />
        {{ action.text }}
      </router-link>
      
      <button
        v-else-if="action.onClick"
        @click="action.onClick"
        :class="actionClasses"
      >
        <component
          v-if="action.icon"
          :is="getIconComponent(action.icon)"
          class="w-5 h-5 mr-2"
        />
        {{ action.text }}
      </button>
    </div>

    <!-- Secondary Actions -->
    <div v-if="secondaryActions && secondaryActions.length" class="mt-4 space-x-4">
      <template v-for="secondaryAction in secondaryActions" :key="secondaryAction.text">
        <router-link
          v-if="secondaryAction.to"
          :to="secondaryAction.to"
          class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {{ secondaryAction.text }}
        </router-link>
        
        <button
          v-else-if="secondaryAction.onClick"
          @click="secondaryAction.onClick"
          class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {{ secondaryAction.text }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  HeartIcon,
  SearchIcon,
  PlusIcon,
  AlertTriangleIcon,  // Changed from ExclamationTriangleIcon
  InfoIcon,           // Changed from InformationCircleIcon
  XCircleIcon,
  CheckCircleIcon,
  UserIcon,
  FolderIcon,
  FileText,           // Changed from DocumentIcon
  StarIcon
} from 'lucide-vue-next'

const props = defineProps({
  icon: {
    type: String,
    default: 'information',
    validator: value => [
      'heart', 'search', 'plus', 'warning', 'information', 
      'error', 'success', 'user', 'folder', 'document', 'star'
    ].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  action: {
    type: Object,
    default: null
    // Expected shape: { text: String, to?: String, onClick?: Function, icon?: String, variant?: String }
  },
  secondaryActions: {
    type: Array,
    default: () => []
    // Expected shape: [{ text: String, to?: String, onClick?: Function }]
  }
})

// Icon mapping
const iconComponents = {
  heart: HeartIcon,
  search: SearchIcon,
  plus: PlusIcon,
  warning: AlertTriangleIcon,      // Changed from ExclamationTriangleIcon
  information: InfoIcon,           // Changed from InformationCircleIcon
  error: XCircleIcon,
  success: CheckCircleIcon,
  user: UserIcon,
  folder: FolderIcon,
  document: FileText,              // Changed from DocumentIcon
  star: StarIcon
}

const iconComponent = computed(() => {
  return iconComponents[props.icon] || InformationCircleIcon
})

const iconColor = computed(() => {
  const colors = {
    heart: 'text-red-400',
    search: 'text-blue-400',
    plus: 'text-green-400',
    warning: 'text-yellow-400',
    information: 'text-blue-400',
    error: 'text-red-400',
    success: 'text-green-400',
    user: 'text-purple-400',
    folder: 'text-gray-400',
    document: 'text-gray-400',
    star: 'text-yellow-400'
  }
  return colors[props.icon] || 'text-gray-400'
})

const actionClasses = computed(() => {
  const variant = props.action?.variant || 'primary'
  const baseClasses = 'inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105'
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  }
  
  return `${baseClasses} ${variants[variant] || variants.primary}`
})

const getIconComponent = (iconName) => {
  return iconComponents[iconName] || InformationCircleIcon
}
</script>