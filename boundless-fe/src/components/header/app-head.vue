<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watch, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/users'
import Vue3Jazzicon from '@/components/jazzicon/vue3-jazzicon.vue'
import { getAccount, getNetwork } from '@wagmi/core'

const { $web3modal } = getCurrentInstance()!.appContext.config.globalProperties
const usersStore = useUsersStore()
const { userInfo } = storeToRefs(usersStore)
const { getUserInfo, getNetworkInfo } = usersStore
const activeIndex = ref('/')
const visible = ref(false)
const router = useRouter()
const currentRoute = router.currentRoute
const onLogin = () => {
  visible.value = false
  $web3modal.openModal()
}
$web3modal.subscribeModal((newState: { open: boolean }) => {
  if (!newState.open) {
    const account = getAccount()
    if (account.address && userInfo.value?.accounts) return
    getUserInfo()
    getNetworkInfo()
  }
})
watch(
  () => currentRoute.value.path,
  (n) => {
    activeIndex.value = n
  }
)
</script>
<template>
  <div class="min-w-full bg-white sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <el-menu :default-active="activeIndex" :router="true" mode="horizontal" :ellipsis="false">
        <el-menu-item index="/"> 市场 </el-menu-item>
        <el-menu-item index="/create"> 创造 </el-menu-item>
        <div class="flex-1"></div>
        <el-menu-item>
          <div class="h-full box-border">
            <el-popover placement="bottom-end" :visible="visible" trigger="click">
              <template #reference>
                <el-avatar class="mb-1.5 relative" @click="visible = !visible">
                  <Vue3Jazzicon
                    class="absolute bottom-0"
                    :diameter="40"
                    :address="userInfo?.accounts || ''"
                  />
                </el-avatar>
              </template>
              <div>
                <div
                  class="text-sm text-black mb-1 hover:underline cursor-pointer"
                  @click="onLogin"
                >
                  {{
                    userInfo?.accounts
                      ? `${userInfo?.accounts?.slice(0, 5)}****${userInfo?.accounts?.slice(-4)}`
                      : '连接钱包'
                  }}
                </div>
                <div
                  class="text-sm text-black mb-1 hover:underline cursor-pointer"
                  @click="
                    () => {
                      router.push('/my-nfts')
                      visible = !visible
                    }
                  "
                >
                  我的NFT
                </div>
              </div>
            </el-popover>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
