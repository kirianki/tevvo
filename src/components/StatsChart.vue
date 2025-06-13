<template>
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Base Stats</h3>
      
      <!-- Stats Bars -->
      <div class="space-y-4">
        <div v-for="stat in formattedStats" :key="stat.name" class="relative">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-700 capitalize">
              {{ stat.displayName }}
            </span>
            <span class="text-sm font-bold text-gray-900">
              {{ stat.value }}
            </span>
          </div>
          
          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
            <div
              class="h-3 rounded-full transition-all duration-1000 ease-out"
              :style="{
                width: `${stat.percentage}%`,
                backgroundColor: stat.color
              }"
            ></div>
            
            <!-- Gradient overlay for visual appeal -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20 rounded-full"
            ></div>
          </div>
        </div>
      </div>
  
      <!-- Total Stats -->
      <div class="mt-6 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Total</span>
          <span class="text-lg font-bold text-gray-900">{{ totalStats }}</span>
        </div>
        
        <!-- Average indicator -->
        <div class="mt-2 text-xs text-gray-500">
          Average: {{ averageStat }} per stat
        </div>
      </div>
  
      <!-- Radar Chart (if type is radar) -->
      <div v-if="chartType === 'radar'" class="mt-6">
        <div class="relative w-full h-64 flex items-center justify-center">
          <svg viewBox="0 0 200 200" class="w-full h-full">
            <!-- Background hexagon -->
            <polygon
              v-for="(level, index) in radarLevels"
              :key="`bg-${index}`"
              :points="getHexagonPoints(level)"
              fill="none"
              :stroke="index === radarLevels.length - 1 ? '#e5e7eb' : '#f3f4f6'"
              stroke-width="1"
            />
            
            <!-- Stat lines -->
            <g v-for="(line, index) in radarLines" :key="`line-${index}`">
              <line
                :x1="100"
                :y1="100"
                :x2="line.x"
                :y2="line.y"
                stroke="#e5e7eb"
                stroke-width="1"
              />
            </g>
            
            <!-- Data polygon -->
            <polygon
              :points="radarDataPoints"
              :fill="radarFillColor"
              fill-opacity="0.3"
              :stroke="radarStrokeColor"
              stroke-width="2"
            />
            
            <!-- Data points -->
            <circle
              v-for="(point, index) in radarDataPointsArray"
              :key="`point-${index}`"
              :cx="point.x"
              :cy="point.y"
              r="3"
              :fill="radarStrokeColor"
            />
            
            <!-- Labels -->
            <text
              v-for="(label, index) in radarLabels"
              :key="`label-${index}`"
              :x="label.x"
              :y="label.y"
              text-anchor="middle"
              dominant-baseline="central"
              class="text-xs fill-current text-gray-600 font-medium"
            >
              {{ label.text }}
            </text>
          </svg>
        </div>
      </div>
  
      <!-- Stats Comparison (if comparison data provided) -->
      <div v-if="comparisonStats" class="mt-6 pt-4 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Compared to Average</h4>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-lg font-bold text-green-600">{{ statsAboveAverage }}</div>
            <div class="text-xs text-gray-500">Above Average</div>
          </div>
          <div>
            <div class="text-lg font-bold text-yellow-600">{{ statsAtAverage }}</div>
            <div class="text-xs text-gray-500">Average</div>
          </div>
          <div>
            <div class="text-lg font-bold text-red-600">{{ statsBelowAverage }}</div>
            <div class="text-xs text-gray-500">Below Average</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    stats: {
      type: Array,
      required: true
    },
    chartType: {
      type: String,
      default: 'bar',
      validator: value => ['bar', 'radar'].includes(value)
    },
    comparisonStats: {
      type: Object,
      default: null
    },
    colorScheme: {
      type: String,
      default: 'default',
      validator: value => ['default', 'fire', 'water', 'grass', 'electric'].includes(value)
    }
  })
  
  // Maximum possible stat value for percentage calculation
  const MAX_STAT = 255
  
  // Color schemes
  const colorSchemes = {
    default: {
      hp: '#ef4444',
      attack: '#f97316',
      defense: '#3b82f6',
      'special-attack': '#8b5cf6',
      'special-defense': '#06b6d4',
      speed: '#10b981'
    },
    fire: {
      hp: '#dc2626',
      attack: '#ea580c',
      defense: '#c2410c',
      'special-attack': '#b45309',
      'special-defense': '#92400e',
      speed: '#78350f'
    },
    water: {
      hp: '#2563eb',
      attack: '#1d4ed8',
      defense: '#1e40af',
      'special-attack': '#1e3a8a',
      'special-defense': '#312e81',
      speed: '#3730a3'
    },
    grass: {
      hp: '#16a34a',
      attack: '#15803d',
      defense: '#166534',
      'special-attack': '#14532d',
      'special-defense': '#052e16',
      speed: '#064e3b'
    },
    electric: {
      hp: '#eab308',
      attack: '#d97706',
      defense: '#c2410c',
      'special-attack': '#b45309',
      'special-defense': '#92400e',
      speed: '#78350f'
    }
  }
  
  // Computed properties
  const formattedStats = computed(() => {
    const colors = colorSchemes[props.colorScheme] || colorSchemes.default
    
    return props.stats.map(stat => ({
      name: stat.stat.name,
      displayName: getStatDisplayName(stat.stat.name),
      value: stat.base_stat,
      percentage: Math.min((stat.base_stat / MAX_STAT) * 100, 100),
      color: colors[stat.stat.name] || '#6b7280'
    }))
  })
  
  const totalStats = computed(() => {
    return props.stats.reduce((total, stat) => total + stat.base_stat, 0)
  })
  
  const averageStat = computed(() => {
    return Math.round(totalStats.value / props.stats.length)
  })
  
  // Radar chart computations
  const radarLevels = computed(() => [20, 40, 60, 80, 100])
  
  const radarLines = computed(() => {
    const angles = []
    const numStats = props.stats.length
    for (let i = 0; i < numStats; i++) {
      const angle = (i * 2 * Math.PI) / numStats - Math.PI / 2
      angles.push({
        x: 100 + Math.cos(angle) * 80,
        y: 100 + Math.sin(angle) * 80
      })
    }
    return angles
  })
  
  const radarDataPoints = computed(() => {
    const points = []
    const numStats = props.stats.length
    
    props.stats.forEach((stat, index) => {
      const angle = (index * 2 * Math.PI) / numStats - Math.PI / 2
      const radius = (stat.base_stat / MAX_STAT) * 80
      const x = 100 + Math.cos(angle) * radius
      const y = 100 + Math.sin(angle) * radius
      points.push(`${x},${y}`)
    })
    
    return points.join(' ')
  })
  
  const radarDataPointsArray = computed(() => {
    const points = []
    const numStats = props.stats.length
    
    props.stats.forEach((stat, index) => {
      const angle = (index * 2 * Math.PI) / numStats - Math.PI / 2
      const radius = (stat.base_stat / MAX_STAT) * 80
      const x = 100 + Math.cos(angle) * radius
      const y = 100 + Math.sin(angle) * radius
      points.push({ x, y })
    })
    
    return points
  })
  
  const radarLabels = computed(() => {
    const labels = []
    const numStats = props.stats.length
    
    props.stats.forEach((stat, index) => {
      const angle = (index * 2 * Math.PI) / numStats - Math.PI / 2
      const x = 100 + Math.cos(angle) * 95
      const y = 100 + Math.sin(angle) * 95
      labels.push({
        x,
        y,
        text: getStatDisplayName(stat.stat.name)
      })
    })
    
    return labels
  })
  
  const radarFillColor = computed(() => {
    const colors = {
      default: '#3b82f680',
      fire: '#ef444480',
      water: '#2563eb80',
      grass: '#16a34a80',
      electric: '#eab30880'
    }
    return colors[props.colorScheme] || colors.default
  })
  
  const radarStrokeColor = computed(() => {
    const colors = {
      default: '#3b82f6',
      fire: '#ef4444',
      water: '#2563eb',
      grass: '#16a34a',
      electric: '#eab308'
    }
    return colors[props.colorScheme] || colors.default
  })
  
  // Comparison stats
  const statsAboveAverage = computed(() => {
    if (!props.comparisonStats) return 0
    return props.stats.filter(stat => 
      stat.base_stat > props.comparisonStats[stat.stat.name]
    ).length
  })
  
  const statsAtAverage = computed(() => {
    if (!props.comparisonStats) return 0
    return props.stats.filter(stat => 
      stat.base_stat === props.comparisonStats[stat.stat.name]
    ).length
  })
  
  const statsBelowAverage = computed(() => {
    if (!props.comparisonStats) return 0
    return props.stats.filter(stat => 
      stat.base_stat < props.comparisonStats[stat.stat.name]
    ).length
  })
  
  // Methods
  const getStatDisplayName = (statName) => {
    const displayNames = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Attack',
      'special-defense': 'Sp. Defense',
      'speed': 'Speed'
    }
    return displayNames[statName] || statName
  }
  
  const getHexagonPoints = (radius) => {
    const points = []
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2
      const x = 100 + Math.cos(angle) * radius
      const y = 100 + Math.sin(angle) * radius
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }
  </script>