<template>
    <svg
      :width="size"
      :height="size"
      :class="classes"
      viewBox="0 0 24 24"
      :fill="filled ? currentColor : 'none'"
      :stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  </template>
  
  <script>
  export default {
    name: 'SearchIcon',
    props: {
      size: {
        type: [String, Number],
        default: 24
      },
      filled: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: 'currentColor'
      },
      strokeWidth: {
        type: [String, Number],
        default: 2
      },
      class: {
        type: [String, Array, Object],
        default: ''
      }
    },
    computed: {
      currentColor() {
        return this.color
      },
      classes() {
        return [
          'search-icon',
          this.class
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .search-icon {
    display: inline-block;
    vertical-align: middle;
    transition: all 0.2s ease;
  }
  
  .search-icon:hover {
    transform: scale(1.1);
  }
  </style>