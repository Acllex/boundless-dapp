<script lang="ts" setup>
import { ipfsToHttps } from '@/utils'
import { useNftStore } from '@/stores/nft'
import NftIcon from '@/components/icon/nft-icon.vue'
import { ref, watch } from 'vue'

defineProps({
  itemInfo: {
    type: Object,
    required: true,
    default() {
      return { tokenId: '', image: '', name: '', price: '', description: '' }
    }
  }
})
const isPreview = ref(false)
const isFront = ref(false)
const dialogWidth = ref('30%')
const nftStore = useNftStore()
const { buyNft } = nftStore
const onBuy = async (tokenId: string, price: string) => {
  await buyNft(tokenId, price)
}
const onPreview = () => {
  dialogWidth.value = document.body.offsetWidth > 1024 ? '30%' : '90%'
  isPreview.value = true
}
watch(isPreview, (val) => {
  if (val) {
    setTimeout(() => {
      isFront.value = true
    }, 500)
  } else {
    isFront.value = false
  }
})
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
        <p class="line-clamp-2 text-gray-400">{{ itemInfo.description || '暂无介绍' }}</p>
        <div class="absolute bottom-2">
          <el-button type="primary" @click="onBuy(itemInfo.tokenId, itemInfo.price)"
            >购买</el-button
          >
          <el-button @click="onPreview">查看</el-button>
        </div>
      </div>
    </div>
  </el-card>
  <el-dialog
    class="no-dialog-padding no-dialog-header no-dialog-bg"
    v-model="isPreview"
    :width="dialogWidth"
    align-center
  >
    <div class="relative w-full h-0 pb-[140%] box-border">
      <div
        class="w-full h-full absolute top-0 left-0 bv-hidden bg-center bg-no-repeat transition-all rounded bg-[url('@/assets/card-back.jpg')]"
        :class="{ 'rotate-y-180': isFront }"
      ></div>
      <div
        class="w-full h-full absolute top-0 left-0 bv-hidden bg-white bg-no-repeat transition-all -rotate-y-180 rounded p-5"
        :class="{ 'rotate-y-0': isFront }"
      >
        <div class="w-full h-0 pb-[100%] relative">
          <img
            class="w-full h-full absolute top-0 left-0 object-scale-down"
            :src="ipfsToHttps(itemInfo.image)"
            :alt="`${itemInfo.name}#${itemInfo.tokenId}`"
          />
        </div>
        <div class="w-full">
          <div class="text-base font-semibold">{{ itemInfo.name }} #{{ itemInfo.tokenId }}</div>
          <p class="line-clamp-2 text-gray-400">{{ itemInfo.description || '暂无介绍' }}</p>
          <div class="mt-2">
            <el-text size="large" tag="b">战斗数值</el-text>
            <div class="grid grid-cols-3 mt-1">
              <div class="text-center grid grid-rows-2">
                <el-text tag="b">100</el-text>
                <el-text type="danger">攻击</el-text>
              </div>
              <div class="text-center grid grid-rows-2">
                <el-text tag="b">100</el-text>
                <el-text type="warning">防御</el-text>
              </div>
              <div class="text-center grid grid-rows-2">
                <el-text tag="b">100</el-text>
                <el-text type="success">生命</el-text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
