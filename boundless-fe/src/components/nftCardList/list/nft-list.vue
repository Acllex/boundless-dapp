<script setup lang="ts">
import NftCard from '../item/nft-card.vue'
import SkeletonCard from '../skeletonCard/skeleton-card.vue'
</script>
<template>
  <div class="grid lg:grid-cols-8 sm:grid-cols-6 grid-cols-3 gap-4 mt-8">
    <!-- <NftCard v-for="i in 6" :key="i" /> -->
    <SkeletonCard v-for="i in 18" :key="i" />
  </div>
</template>
