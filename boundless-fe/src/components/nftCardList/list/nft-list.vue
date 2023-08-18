<script setup lang="ts">
import { onMounted } from 'vue'
import NftCard from '../item/nft-card.vue'
import { storeToRefs } from 'pinia'
import SkeletonCard from '../skeletonCard/skeleton-card.vue'
import { useNftStore } from '@/stores/nft'
const nftStore = useNftStore()
const { nftMyList, nftLoading } = storeToRefs(nftStore)
const { getNftMyList } = nftStore
onMounted(() => {
  getNftMyList()
})
</script>
<template>
  <div>
    <div v-if="nftMyList.length" class="grid lg:grid-cols-8 sm:grid-cols-6 grid-cols-3 gap-4 mt-8">
      <NftCard v-for="(o, i) in nftMyList" :key="i" :item-info="o" />
    </div>
    <div v-else-if="nftLoading" class="grid lg:grid-cols-8 sm:grid-cols-6 grid-cols-3 gap-4 mt-8">
      <SkeletonCard v-for="i in 18" :key="i" />
    </div>
    <el-empty v-else-if="!nftLoading && !nftMyList.length" description="您还没有NFT收藏" />
  </div>
</template>
