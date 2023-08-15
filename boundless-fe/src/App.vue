<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHead from '@/components/header/app-head.vue'
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <AppHead />
    <div class="py-8 px-4 min-w-full overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>
