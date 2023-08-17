<script setup lang="ts">
defineProps({
  href: {
    type: String,
    required: true,
    default: ''
  }
})
</script>
<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="href"></use>
  </svg>
</template>
