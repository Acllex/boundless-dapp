<script lang="ts" setup>
import { ipfsToHttps } from '@/utils'
defineProps({
  itemInfo: {
    type: Object,
    required: true,
    default() {
      return { tokenId: '', image: '', name: '', price: '', description: '' }
    }
  }
})
</script>

<template>
  <el-card shadow="always" :body-style="{ padding: '0px' }">
    <div class="w-full h-0 pb-[100%] relative">
      <img
        class="w-full h-full absolute top-0 left-0 object-scale-down"
        :src="ipfsToHttps(itemInfo.image)"
        :alt="`${itemInfo.name}#${itemInfo.tokenId}`"
      />
    </div>
    <div class="w-full h-0 pb-[40%]">
      <div class="p-[14px]">
        <div class="text-base font-semibold">{{ itemInfo.name }} #{{ itemInfo.tokenId }}</div>
        <div class="text-base font-bold">{{ itemInfo.price }}</div>
        <div class="text-[#999]">{{ itemInfo.description }}</div>
        <div class="bottom mt-[13px]">
          <el-button text class="button">购买</el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>
