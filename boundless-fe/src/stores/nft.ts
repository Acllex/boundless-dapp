import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'

type NftList = {
  tokenId: string
  uri: string
}
export const useNftStore = defineStore('nft', () => {
  const nftInfo = ref({ name: '', symbol: '' })
  const nftList = ref([]) as unknown as NftList[]
  async function getNftInfo() {
    const { contract } = useWeb3Api()
    if (!contract) return
    const name = await contract.name()
    const symbol = await contract.symbol()
    const nftLists = await contract.getAllNftsOnSale()

    nftLists.forEach(async (nft) => {
      const uri = await contract.tokenURI(nft.tokenId.toString())
      nftList.values.apply({ tokenId: nft.tokenId.toString(), uri })
    })
    nftInfo.value = { name, symbol }
  }
  getNftInfo()
  return { nftInfo, getNftInfo }
})
