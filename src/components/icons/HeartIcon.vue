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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  </template>
  
  <script>
  export default {
    name: 'HeartIcon',
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
          'heart-icon',
          this.class
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .heart-icon {
    display: inline-block;
    vertical-align: middle;
    transition: all 0.2s ease;
  }
  
  .heart-icon:hover {
    transform: scale(1.1);
  }
  </style>