<script lang="ts" setup>
import NftItem from '@/components/nft/item/NftItem.vue'
import nft from '@/content/meta.json'
import { useNftListStore } from '@/stores/nft'
const nftListStore = useNftListStore()
// const { getNftList } = nftListStore
</script>

<template>
  <el-row :gutter="20">
    <el-col v-for="o in nft" :key="o" :span="6">
      <NftItem class="text-gray-900" :item-info="o" />
    </el-col>
  </el-row>
</template>
@/stores/nft
