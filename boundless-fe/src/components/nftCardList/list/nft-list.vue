<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NftCard from '../item/nft-card.vue'
import { storeToRefs } from 'pinia'
import SkeletonCard from '../skeletonCard/skeleton-card.vue'
import { useNftStore } from '@/stores/nft'
import { useUsersStore } from '@/stores/users'
import SelectCard from '@/components/selectCard/select-card.vue'
type ItemInfo = {
  tokenId: string
  image: string
  name: string
  isListed: boolean
  price: string
  description: string
  combat?: {
    attack: string
    defense: string
    health: string
  }
}
const router = useRouter()
const nftStore = useNftStore()
const usersStore = useUsersStore()
const { nftMyList, nftLoading } = storeToRefs(nftStore)
const { networkInfo } = storeToRefs(usersStore)
const { getNftMyList, cancelNftOnSale } = nftStore
const itemInfo = ref({
  tokenId: '',
  image: '',
  isListed: false,
  name: '',
  price: '',
  description: ''
} as ItemInfo)
const isPreview = ref(false)
watch(networkInfo, () => {
  getNftMyList()
})
onMounted(() => {
  getNftMyList()
})

const getCardInfo = (info: ItemInfo) => {
  itemInfo.value = info
  isPreview.value = true
}
const sellNft = () => {
  router.push({
    path: '/create',
    query: {
      id: itemInfo.value.tokenId
    }
  })
}
const cancelNft = () => {
  cancelNftOnSale(itemInfo.value.tokenId)
}
</script>
<template>
  <div class="grid sm:grid-cols-3 grid-cols-2">
    <div class="col-span-2">
      <h2>我的NFT收藏</h2>
      <div v-if="nftLoading" class="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-3 gap-4 mt-8">
        <SkeletonCard v-for="i in 18" :key="i" />
      </div>
      <div
        v-else-if="nftMyList.length"
        class="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-3 gap-4 mt-8"
      >
        <div v-for="o in nftMyList" :key="o.tokenId">
          <NftCard :item-info="o" @click-card="getCardInfo" />
        </div>
      </div>
      <el-empty v-else-if="!nftLoading && !nftMyList.length" description="您还没有NFT收藏" />
    </div>
    <div v-if="itemInfo?.tokenId" class="lg:px-6 sm:block hidden">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <SelectCard :item-info="itemInfo" />
        <div class="p-3 flex justify-center">
          <el-button :disabled="itemInfo?.isListed" type="primary" @click="sellNft"
            >挂卖NFT</el-button
          >
          <el-button :disabled="!itemInfo?.isListed" @click="cancelNft">取消挂卖</el-button>
        </div>
      </el-card>
    </div>
  </div>
  <div class="sm:hidden">
    <el-dialog
      class="no-dialog-padding no-dialog-header"
      v-model="isPreview"
      width="90%"
      align-center
      destroy-on-close
    >
      <SelectCard :item-info="itemInfo">
        <template #footer>
          <div class="flex justify-center mt-2">
            <el-button :disabled="itemInfo?.isListed" type="primary" @click="sellNft" link
              >挂卖NFT</el-button
            >
            <el-button :disabled="!itemInfo?.isListed" @click="cancelNft" link>取消挂卖</el-button>
          </div>
        </template>
      </SelectCard>
    </el-dialog>
  </div>
</template>
