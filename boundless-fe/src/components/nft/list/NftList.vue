<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import SkeletonCard from '@/components/skeletonCard/skeleton-card.vue'
import NftItem from '@/components/nft/item/NftItem.vue'
import { useNftStore } from '@/stores/nft'
const nftStore = useNftStore()
const { nftList } = storeToRefs(nftStore)
</script>

<template>
  <div v-if="nftList.length" class="grid sm:grid-cols-1 gap-4 lg:grid-cols-4">
    <div v-for="(o, i) in nftList" :key="i">
      <NftItem :item-info="o" />
    </div>
  </div>
  <div v-else class="grid sm:grid-cols-1 gap-4 lg:grid-cols-4">
    <div v-for="i in 8" :key="i">
      <SkeletonCard />
    </div>
  </div>
</template>
@/stores/nftList
