<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import NftItem from '@/components/nft/item/NftItem.vue'
import nft from '@/content/meta.json'
import { useNftStore } from '@/stores/nft'

const nftStore = useNftStore()
const { getNftList } = nftStore
const { nftList } = storeToRefs(nftStore)
console.log(nftList.value)

await getNftList()
</script>

<template>
  <el-row :gutter="20">
    <el-col v-for="o in nft" :key="o" :span="6">
      <NftItem class="text-gray-900" :item-info="o" />
    </el-col>
  </el-row>
</template>
@/stores/nftList
