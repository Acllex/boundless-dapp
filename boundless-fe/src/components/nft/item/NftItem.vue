<script lang="ts" setup>
import { ipfsToHttps } from '@/utils'
import { useNftStore } from '@/stores/nft'
import { useUsersStore } from '@/stores/users'
import NftIcon from '@/components/icon/nft-icon.vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import SelectCard from '@/components/selectCard/select-card.vue'
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
const dialogWidth = ref('30%')
const nftStore = useNftStore()
const usersStore = useUsersStore()
const { userInfo } = storeToRefs(usersStore)
const buyLoading = ref(false)

const { buyNft } = nftStore
const onBuy = async (tokenId: string, price: string) => {
  buyLoading.value = true
  await buyNft(tokenId, price).finally(() => {
    buyLoading.value = false
  })
}
const onPreview = () => {
  dialogWidth.value = document.body.offsetWidth > 1024 ? '30%' : '90%'
  isPreview.value = true
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
        <p class="line-clamp-2 text-gray-400">{{ itemInfo.description || '暂无介绍' }}</p>
        <div class="absolute bottom-2">
          <el-button
            type="primary"
            :disabled="itemInfo.owner == userInfo?.accounts"
            @click="onBuy(itemInfo.tokenId, itemInfo.price)"
            :loading="buyLoading"
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
    destroy-on-close
  >
    <SelectCard :item-info="itemInfo" />
  </el-dialog>
</template>
