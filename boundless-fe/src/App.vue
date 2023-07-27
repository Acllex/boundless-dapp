<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()
const { web3Api } = storeToRefs(store)
const onSigner = async () => {
  if (!web3Api.value.provider) return
  const signer = await web3Api.value.provider.getSigner()
  if (signer) {
    console.log('Signer successfully detected!')
    const accounts = await signer.getAddress()
    console.log(accounts)
  }
}
onMounted(onSigner)

const activeIndex = ref('/')
const router = useRouter()
const currentRoute = router.currentRoute
watch(
  () => currentRoute.value.path,
  (n) => {
    activeIndex.value = n
  }
)
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="min-w-full bg-white sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <el-menu :default-active="activeIndex" :router="true" mode="horizontal" :ellipsis="false">
          <el-menu-item index="/"> Home </el-menu-item>
          <el-menu-item index="/about"> 创造 </el-menu-item>
          <div class="flex-1"></div>
          <el-menu-item>
            <div class="h-full box-border">
              <el-avatar class="mb-1.5" src="" />
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </div>

    <div class="py-8 min-w-full overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>
