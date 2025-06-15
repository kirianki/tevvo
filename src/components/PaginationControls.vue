<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 20
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hasNext: {
    type: Boolean,
    default: false
  },
  hasPrevious: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['page-change', 'size-change'])

const pageSizeOptions = [10, 20, 50, 100]

// Add guards to prevent infinite loops
const safeCurrentPage = computed(() => {
  const page = props.currentPage
  return (page >= 1 && page <= props.totalPages) ? page : 1
})

const safeTotalPages = computed(() => {
  return props.totalPages > 0 ? props.totalPages : 1
})

function goToPage(page) {
  const targetPage = parseInt(page)
  if (targetPage >= 1 && targetPage <= safeTotalPages.value && targetPage !== safeCurrentPage.value) {
    emit('page-change', targetPage)
  }
}

function handleSizeChange(event) {
  const newSize = parseInt(event.target.value)
  if (newSize !== props.pageSize) {
    emit('size-change', newSize)
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
      <!-- Page size selector -->
      <div class="flex items-center">
        <span class="text-sm text-gray-700 mr-3">Items per page:</span>
        <select
          :value="props.pageSize"
          @change="handleSizeChange"
          :disabled="props.isLoading"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Page navigation -->
      <div class="flex items-center gap-2">
        <button
          @click="emit('page-change', 1)"
          :disabled="props.isLoading || safeCurrentPage === 1"
          class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          aria-label="First page"
        >
          «
        </button>
        <button
          @click="goToPage(safeCurrentPage - 1)"
          :disabled="props.isLoading || !props.hasPrevious"
          class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          aria-label="Previous page"
        >
          ‹
        </button>

        <div class="flex items-center gap-1 mx-2">
          <template v-if="props.totalPages <= 7">
            <button
              v-for="page in props.totalPages"
              :key="page"
              @click="emit('page-change', page)"
              :disabled="props.isLoading"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium"
              :class="{
                'bg-blue-600 text-white': page === props.currentPage,
                'border border-gray-300 text-gray-700 hover:bg-gray-50': page !== props.currentPage
              }"
            >
              {{ page }}
            </button>
          </template>
          <template v-else>
            <!-- Always show first page -->
            <button
              @click="emit('page-change', 1)"
              :disabled="props.isLoading"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium"
              :class="{
                'bg-blue-600 text-white': 1 === props.currentPage,
                'border border-gray-300 text-gray-700 hover:bg-gray-50': 1 !== props.currentPage
              }"
            >
              1
            </button>

            <!-- Show ellipsis or pages near current -->
            <template v-if="props.currentPage > 3">
              <span class="px-2 text-gray-500">...</span>
            </template>

            <!-- Show current page and neighbors -->
            <template v-if="props.currentPage <= 3">
              <button
                v-for="page in [2, 3, 4]"
                :key="page"
                @click="emit('page-change', page)"
                :disabled="props.isLoading"
                class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium"
                :class="{
                  'bg-blue-600 text-white': page === props.currentPage,
                  'border border-gray-300 text-gray-700 hover:bg-gray-50': page !== props.currentPage
                }"
              >
                {{ page }}
              </button>
            </template>
            <template v-else-if="props.currentPage >= props.totalPages - 2">
              <button
                v-for="page in [props.totalPages - 3, props.totalPages - 2, props.totalPages - 1]"
                :key="page"
                @click="emit('page-change', page)"
                :disabled="props.isLoading"
                class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium"
                :class="{
                  'bg-blue-600 text-white': page === props.currentPage,
                  'border border-gray-300 text-gray-700 hover:bg-gray-50': page !== props.currentPage
                }"
              >
                {{ page }}
              </button>
            </template>
            <template v-else>
              <button
                v-for="page in [props.currentPage - 1, props.currentPage, props.currentPage + 1]"
                :key="page"
                @click="emit('page-change', page)"
                :disabled="props.isLoading"
                class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium"
                :class="{
                  'bg-blue-600 text-white': page === props.currentPage,
                  'border border-gray-300 text-gray-700 hover:bg-gray-50': page !== props.currentPage
                }"
              >
                {{ page }}
              </button>
            </template>

            <!-- Show ellipsis or pages near end -->
            <template v-if="props.currentPage < props.totalPages - 2">
              <span class="px-2 text-gray-500">...</span>
            </template>

            <!-- Always show last page -->
            <button
              @click="emit('page-change', props.totalPages)"
              :disabled="props.isLoading"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium"
              :class="{
                'bg-blue-600 text-white': props.totalPages === props.currentPage,
                'border border-gray-300 text-gray-700 hover:bg-gray-50': props.totalPages !== props.currentPage
              }"
            >
              {{ props.totalPages }}
            </button>
          </template>
        </div>

        <button
          @click="emit('page-change', props.currentPage + 1)"
          :disabled="props.isLoading || !props.hasNext"
          class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          aria-label="Next page"
        >
          ›
        </button>
        <button
          @click="emit('page-change', props.totalPages)"
          :disabled="props.isLoading || props.currentPage === props.totalPages"
          class="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          aria-label="Last page"
        >
          »
        </button>
      </div>

      <!-- Page info -->
      <div class="text-sm text-gray-700">
        Page {{ props.currentPage }} of {{ props.totalPages }}
      </div>
    </div>
  </div>
</template>