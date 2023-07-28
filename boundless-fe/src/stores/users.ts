import { ref, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'
export const useUsersStore = defineStore('users', () => {
  const web3Api = ref()
  onBeforeMount(() => {
    web3Api.value = useWeb3Api()
  })
  return { web3Api }
})
