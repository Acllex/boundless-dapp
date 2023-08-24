import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAccount, getNetwork } from '@wagmi/core'

export const useUsersStore = defineStore(
  'users',
  () => {
    const userInfo = ref()
    const networkInfo = ref()

    // 获取用户信息
    function getUserInfo() {
      const account = getAccount()
      userInfo.value = { accounts: account.address }
    }
    function getNetworkInfo() {
      const network = getNetwork()
      networkInfo.value = { network: network.chains[0].name }
    }
    return { userInfo, networkInfo, getUserInfo, getNetworkInfo }
  },
  {
    persist: true
  }
)
