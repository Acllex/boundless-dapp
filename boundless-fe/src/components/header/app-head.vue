<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/users'
import { useWeb3Api, changeChain, openInMetamask } from '@/utils'
import { ElMessage } from 'element-plus'
import Vue3Jazzicon from '@/components/jazzicon/vue3-jazzicon.vue'
const { provider, ethereum } = await useWeb3Api()
const NETWORKS: { [k: number]: string } = {
  1: '以太坊主网',
  3: 'Ropsten测试网',
  4: 'Rinkeby测试网',
  5: 'Goerli测试网',
  42: 'Kovan测试网',
  56: 'BSC主网',
  97: 'BSC测试网',
  128: 'HECO主网',
  256: 'HECO测试网',
  137: 'Polygon主网',
  80001: 'Polygon测试网',
  250: 'Fantom主网',
  4002: 'Fantom测试网',
  42161: 'Arbitrum主网',
  421611: 'Arbitrum测试网',
  1666600000: 'Harmony主网',
  1666700000: 'Harmony测试网',
  43114: 'Avalanche主网',
  43113: 'Avalanche测试网',
  100: 'xDai主网',
  77: 'Sokol测试网',
  1337: 'Localhost 8545',
  59144: 'Linea Mainnet',
  11155111: 'Sepolia测试网络',
  59140: 'Linea Testnet',
  44787: 'Alfajores测试网'
}
const usersStore = useUsersStore()
const { userInfo, networkInfo } = storeToRefs(usersStore)
const { getUserInfo } = usersStore
const activeIndex = ref('/')
const jumpUrl = ref(openInMetamask())
const router = useRouter()
const currentRoute = router.currentRoute
const onLogin = () => {
  getUserInfo()
}
const onAccountChange = async () => {
  if (!provider) return
  getUserInfo()
  ElMessage.success('账户切换成功')
}
const onNetworkChange = (chainId: string) => {
  networkInfo.value = { isLoading: false, name: NETWORKS[Number(chainId)] }
}
onMounted(async () => {
  if (!ethereum || !provider) {
    networkInfo.value = { isLoading: false, name: '无法获取网络' }
    return
  }
  // 监听账户变化
  ethereum.on('accountsChanged', onAccountChange)

  // 监听网络变化
  const { chainId } = await provider.getNetwork()
  if (Number(chainId) !== 44787) {
    const res = await changeChain()
    ElMessage.info(res)
  }
  networkInfo.value = { isLoading: false, name: NETWORKS[Number(chainId)] }
  ethereum.on('chainChanged', onNetworkChange)
})
onUnmounted(() => {
  ethereum.removeListener('accountsChanged', onAccountChange)
  ethereum.removeListener('chainChanged', onNetworkChange)
})
watch(
  () => currentRoute.value.path,
  (n) => {
    activeIndex.value = n
  }
)
const downloadMetamask = () => {
  window.open('https://metamask.io/download/', '_blank')
}
const onJump = () => {
  if (!jumpUrl.value) return
  window.open(jumpUrl.value, '_blank')
}
</script>
<template>
  <div class="min-w-full bg-white sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <el-menu :default-active="activeIndex" :router="true" mode="horizontal" :ellipsis="false">
        <el-menu-item index="/"> 市场 </el-menu-item>
        <el-menu-item index="/create"> 创造 </el-menu-item>
        <div class="flex-1"></div>
        <div class="sm:flex items-center hidden">
          <el-tag class="font-bold"
            >• {{ networkInfo.isLoading === true ? '加载中...' : networkInfo.name }}</el-tag
          >
        </div>
        <el-menu-item>
          <div class="h-full box-border">
            <el-popover v-if="userInfo?.accounts" placement="bottom-end" trigger="click">
              <template #reference>
                <el-avatar class="mb-1.5 relative">
                  <Vue3Jazzicon
                    class="absolute bottom-0"
                    :diameter="40"
                    :address="userInfo?.accounts"
                  />
                </el-avatar>
              </template>
              <div>
                <div class="text-sm text-gray-400 mb-2">
                  {{ userInfo?.accounts.slice(0, 5) }}****{{ userInfo?.accounts.slice(-4) }}
                </div>
                <div
                  class="text-sm text-black mb-1 hover:underline cursor-pointer"
                  @click="router.push('/my-nfts')"
                >
                  我的NFT
                </div>
              </div>
            </el-popover>
            <el-button
              v-else-if="ethereum && provider"
              type="primary"
              size="small"
              @click="onLogin"
              round
            >
              登录
            </el-button>
            <el-button v-else-if="jumpUrl" @click="onJump">MetaMask</el-button>
            <el-button v-else type="primary" size="small" @click="downloadMetamask" round>
              下载钱包
            </el-button>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
