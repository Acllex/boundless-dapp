<script setup lang="ts">
import { ipfsToHttps } from '@/utils'
const props = defineProps({
  itemInfo: {
    type: Object,
    required: true,
    default() {
      return { tokenId: '', image: '', name: '', price: '', description: '' }
    }
  }
})
const emit = defineEmits(['clickCard'])
const onClick = () => {
  emit('clickCard', props.itemInfo)
}
</script>
<template>
  <el-card shadow="always" :body-style="{ padding: '0px' }" @click="onClick">
    <div class="w-full h-0 pb-[100%] relative">
      <img
        class="w-full h-full absolute top-0 left-0 object-scale-down"
        :src="ipfsToHttps(itemInfo.image)"
        :alt="`${itemInfo.name}#${itemInfo.tokenId}`"
      />
    </div>
  </el-card>
</template>
