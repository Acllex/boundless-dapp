import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'
import { ElMessage } from 'element-plus'
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
  59140: 'Linea Testnet'
}
export const useUsersStore = defineStore(
  'users',
  () => {
    const userInfo = ref({
      accounts: '',
      isLoading: false
    })
    const networkInfo = ref({
      name: '',
      isLoading: false
    })

    // 获取用户信息
    async function getUserInfo() {
      if (!provider || !ethereum) return
      userInfo.value = { isLoading: true, accounts: '' }
      const signer = await provider.getSigner()
      const accounts = await signer.getAddress()
      userInfo.value = { accounts, isLoading: false }
    }

    onMounted(async () => {
      if (!ethereum || !provider) {
        networkInfo.value = { isLoading: false, name: '无法获取网络' }
        return
      }
      // 监听账户变化
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          userInfo.value = { isLoading: false, accounts: '' }
          return
        }
        if (accounts[0] === userInfo.value.accounts) return
        ElMessage.success('账户切换成功')
        userInfo.value = { isLoading: false, accounts: accounts[0] }
      })

      // 监听网络变化
      const { chainId } = await provider.getNetwork()
      networkInfo.value = { isLoading: false, name: NETWORKS[Number(chainId)] }
      ethereum.on('chainChanged', (chainId: string) => {
        networkInfo.value = { isLoading: false, name: NETWORKS[Number(chainId)] }
      })
    })

    return { userInfo, getUserInfo, networkInfo }
  },
  {
    persist: true
  }
)
