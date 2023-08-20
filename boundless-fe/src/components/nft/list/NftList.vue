<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import SkeletonCard from '../skeletonCard/skeleton-card.vue'
import NftItem from '@/components/nft/item/NftItem.vue'
import { useNftStore } from '@/stores/nft'
const nftStore = useNftStore()
const { nftList, nftLoading } = storeToRefs(nftStore)
const { getNftList } = nftStore
onMounted(() => {
  getNftList()
})
</script>

<template>
  <div v-if="nftList.length" class="grid sm:grid-cols-2 gap-4 lg:grid-cols-4">
    <div v-for="(o, i) in nftList" :key="i">
      <NftItem :item-info="o" />
    </div>
  </div>
  <div v-else-if="nftLoading" class="grid sm:grid-cols-2 gap-4 lg:grid-cols-4">
    <SkeletonCard v-for="i in 8" :key="i" />
  </div>
  <el-empty v-else-if="!nftLoading && !nftList.length" description="您还没有NFT收藏" />
</template>
