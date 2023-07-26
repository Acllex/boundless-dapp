<script lang="ts" setup>
const props = defineProps({
  itemInfo: {
    type: Object,
    required: true,
    default() {
      return { image: '', name: '',description: '' }
    }
  }
})
console.log(props.itemInfo)
</script>

<template>
  <el-card :body-style="{ padding: '0px' }">
    <el-image
        loading="lazy"
        :src="itemInfo.image"
        class=" w-full block"
        alt="nft"
    >
      <template #placeholder>
        <div class="">Loading<span class="dot">...</span></div>
      </template>
    </el-image>
    <div class="p-[14px]">
      <div>{{itemInfo.name}}</div>
      <div class="text-[#999]">{{itemInfo.description}}</div>
      <div class="bottom mt-[13px]">

        <el-button text class="button">Operating</el-button>
      </div>
    </div>
  </el-card>
</template>