<script setup lang="ts">
import { storeToRefs } from 'pinia'
import NftList from '../components/nft/list/NftList.vue'
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()
const { web3Api } = storeToRefs(store)
</script>

<template>
  <main class="max-w-7xl bg-white mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <NftList />
  </main>
</template>
