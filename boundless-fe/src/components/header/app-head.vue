<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watch, getCurrentInstance, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/users'
import { watchNetwork, switchNetwork } from '@wagmi/core'
import { ElMessage } from 'element-plus'

const { $web3modal } = getCurrentInstance()!.appContext.config.globalProperties
const usersStore = useUsersStore()
const { userInfo } = storeToRefs(usersStore)
const { getUserInfo } = usersStore
const activeIndex = ref('/')
const router = useRouter()
const currentRoute = router.currentRoute
watchNetwork(async (network) => {
  if (network.chain && network?.chain.id !== 44787) {
    ElMessage.error('请切换网络到Alfajores Testnet')
    await switchNetwork({
      chainId: 44787
    })
  }
})
onMounted(() => {
  getUserInfo()
})
const onLogin = () => {
  $web3modal.openModal()
}
$web3modal.subscribeModal((newState: { open: boolean }) => {
  if (!newState.open) {
    getUserInfo()
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
            <el-popover placement="bottom-end" trigger="click">
              <template #reference>
                <el-button color="#626aef">个人中心</el-button>
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
