<script lang="ts" setup>
import { watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import SkeletonCard from '../skeletonCard/skeleton-card.vue'
import NftItem from '@/components/nft/item/NftItem.vue'
import { useNftStore } from '@/stores/nft'
import { useUsersStore } from '@/stores/users'
import { changeChain } from '@/utils'
const nftStore = useNftStore()
const usersStore = useUsersStore()
const { nftList, nftLoading, nftMessage } = storeToRefs(nftStore)
const { networkInfo } = storeToRefs(usersStore)
const { getNftList } = nftStore
onMounted(() => {
  getNftList()
})
watch(
  networkInfo,
  () => {
    getNftList()
  },
  {
    immediate: true
  }
)
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
  <el-empty v-else-if="nftMessage" :description="nftMessage">
    <el-button type="primary" @click="changeChain">切换网络</el-button>
  </el-empty>
  <el-empty v-else-if="!nftLoading && !nftList.length" description="当前没有在售NFT" />
</template>
