<template>
    <div class="virtual-scroll-container" ref="container" @scroll="handleScroll">
      <div class="virtual-scroll-content" :style="{ height: `${totalHeight}px` }">
        <div
          v-for="item in visibleItems"
          :key="itemKey ? item[itemKey] : item.id"
          class="virtual-scroll-item"
          :style="{ transform: `translateY(${item.offset}px)` }"
        >
          <slot :item="item.data" :index="item.index" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  
  const props = defineProps({
    items: { type: Array, required: true },
    itemSize: { type: Number, required: true },
    buffer: { type: Number, default: 5 },
    itemKey: { type: String, default: 'id' }
  })
  
  const emit = defineEmits(['visible-items-change'])
  
  const container = ref(null)
  const scrollPosition = ref(0)
  const containerHeight = ref(0)
  const resizeObserver = ref(null)
  
  // Calculate visible items
  const visibleItems = computed(() => {
    if (!containerHeight.value) return []
  
    const startIdx = Math.max(0, Math.floor(scrollPosition.value / props.itemSize) - props.buffer)
    const endIdx = Math.min(
      props.items.length - 1,
      Math.ceil((scrollPosition.value + containerHeight.value) / props.itemSize) + props.buffer
    )
  
    const items = []
    for (let i = startIdx; i <= endIdx; i++) {
      items.push({
        data: props.items[i],
        index: i,
        offset: i * props.itemSize
      })
    }
  
    // Emit visible item IDs for preloading
    const visibleIds = items.map(item => item.data.id)
    emit('visible-items-change', visibleIds)
  
    return items
  })
  
  const totalHeight = computed(() => props.items.length * props.itemSize)
  
  const handleScroll = () => {
    if (container.value) {
      scrollPosition.value = container.value.scrollTop
    }
  }
  
  const updateContainerHeight = () => {
    if (container.value) {
      containerHeight.value = container.value.clientHeight
    }
  }
  
  onMounted(() => {
    updateContainerHeight()
    resizeObserver.value = new ResizeObserver(updateContainerHeight)
    if (container.value) {
      resizeObserver.value.observe(container.value)
    }
  })
  
  onUnmounted(() => {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect()
    }
  })
  
  watch(() => props.items, () => {
    if (container.value) {
      container.value.scrollTop = 0
      scrollPosition.value = 0
    }
  })
  </script>
  
  <style scoped>
  .virtual-scroll-container {
    overflow-y: auto;
    height: 100%;
    position: relative;
  }
  
  .virtual-scroll-content {
    position: relative;
  }
  
  .virtual-scroll-item {
    position: absolute;
    width: 100%;
    will-change: transform;
  }
  </style>