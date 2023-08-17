<script lang="ts" setup>
import { ipfsToHttps } from '@/utils'
import { useNftStore } from '@/stores/nft'
import NftIcon from '@/components/icon/nft-icon.vue'
defineProps({
  itemInfo: {
    type: Object,
    required: true,
    default() {
      return { tokenId: '', image: '', name: '', price: '', description: '' }
    }
  }
})
const nftStore = useNftStore()
const { buyNft } = nftStore
const onBuy = async (tokenId: string, price: string) => {
  await buyNft(tokenId, price)
}
</script>

<template>
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
        <p class="line-clamp-2">{{ itemInfo.description || '暂无介绍' }}</p>
        <div class="absolute bottom-2">
          <el-button type="primary" @click="onBuy(itemInfo.tokenId, itemInfo.price)"
            >购买</el-button
          >
          <el-button>查看</el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>
