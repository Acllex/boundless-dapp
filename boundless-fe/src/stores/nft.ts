import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'
export const useNftListStore = defineStore('nftList', () => {
  const nftInfo = ref({ name: '', symbol: '' })
  async function getNftInfo() {
    const { contract } = useWeb3Api()
    if (!contract) return
    const name = await contract.name()
    const symbol = await contract.symbol()
    const nftList = await contract.getAllNftsOnSale()
    nftList.forEach(async (nft) => {
      console.log(await contract.tokenURI(nft.tokenId.toString()))
    })
    nftInfo.value = { name, symbol }
  }
  getNftInfo()
  return { nftInfo, getNftInfo }
})
