<script lang="ts" setup>
import NftItem from '@/components/nft/item/NftItem.vue'
import nft from '@/content/meta.json'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
const store = useUsersStore()
const { web3Api } = storeToRefs(store)
const name = ref('')
watch(web3Api, async (n) => {
  console.log(n, 'web3Api')
  if (n) {
    // name.value = await n.contract.name()
    console.log(await n.contract.getAddress(), 'name')
  }
})
</script>

<template>
  <el-row :gutter="20">
    <el-col v-for="o in nft" :key="o" :span="6">
      <NftItem class="text-gray-900" :item-info="o" />
    </el-col>
  </el-row>
</template>
