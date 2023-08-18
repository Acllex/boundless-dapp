<script setup lang="ts">
import { ipfsToHttps } from '@/utils'
import { onMounted, ref, watch, nextTick } from 'vue'
import NftCard from '../item/nft-card.vue'
import { storeToRefs } from 'pinia'
import SkeletonCard from '../skeletonCard/skeleton-card.vue'
import { useNftStore } from '@/stores/nft'
type ItemInfo = {
  tokenId: string
  image: string
  name: string
  price: string
  description: string
  combat?: {
    attack: string
    defense: string
    health: string
  }
}
const nftStore = useNftStore()
const { nftMyList, nftLoading } = storeToRefs(nftStore)
const { getNftMyList } = nftStore
const itemInfo = ref({
  tokenId: '',
  image: '',
  name: '',
  price: '',
  description: ''
} as ItemInfo)
onMounted(() => {
  getNftMyList()
  nextTick(() => {
    console.log(nftMyList.value)
  })
  console.log(nftMyList.value)
})
watch(nftMyList.value, (newVal) => {
  if (newVal.length) {
    console.log(newVal[0])

    itemInfo.value = newVal[0]
  }
})
const getCardInfo = (info: ItemInfo) => {
  itemInfo.value = info
}
</script>
<template>
  <div class="grid sm:grid-cols-3 grid-cols-2">
    <div class="col-span-2">
      <h2>我的NFT收藏</h2>
      <div
        v-if="nftMyList.length"
        class="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-3 gap-4 mt-8"
      >
        <NftCard @click-card="getCardInfo" v-for="(o, i) in nftMyList" :key="i" :item-info="o" />
      </div>
      <div v-else-if="nftLoading" class="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-3 gap-4 mt-8">
        <SkeletonCard v-for="i in 18" :key="i" />
      </div>
      <el-empty v-else-if="!nftLoading && !nftMyList.length" description="您还没有NFT收藏" />
    </div>
    <div class="lg:px-6 sm:block hidden">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="w-full h-0 pb-[100%] relative">
          <img
            class="w-full h-full absolute top-0 left-0 object-scale-down"
            :src="ipfsToHttps(itemInfo.image)"
            :alt="`${itemInfo.name}#${itemInfo.tokenId}`"
          />
        </div>
        <div class="h-0 pb-[55%] relative">
          <div class="p-[14px]">
            <div class="text-base font-semibold">{{ itemInfo.name }} #{{ itemInfo.tokenId }}</div>
            <div class="text-base font-bold flex items-center text-blue-500">
              <span class="pr-1">{{ itemInfo.price }}</span>
              <NftIcon href="#icon-ETH" />
            </div>
            <p class="line-clamp-2 text-gray-400">{{ itemInfo.description || '暂无介绍' }}</p>
            <div class="absolute bottom-2">
              <!-- <el-button type="primary" @click="onBuy(itemInfo.tokenId, itemInfo.price)"
                >购买</el-button
              >
              <el-button @click="onPreview">查看</el-button> -->
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
