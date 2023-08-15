import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'
const { provider, ethereum } = await useWeb3Api()

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

    return { userInfo, getUserInfo, networkInfo }
  },
  {
    persist: true
  }
)
