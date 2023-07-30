import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'
export const useNftStore = defineStore('nft', () => {
  const nftInfo = ref({ name: '', symbol: '' })
  async function getNftInfo() {
    const { contract } = useWeb3Api()
    if (!contract) return
    const name = await contract.name()
    const symbol = await contract.symbol()
    nftInfo.value = { name, symbol }
  }
  getNftInfo()
  return { nftInfo, getNftInfo }
})
