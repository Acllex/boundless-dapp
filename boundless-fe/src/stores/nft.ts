import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'
import { ethers } from 'ethers'
const { contract, ethereum } = useWeb3Api()
type NftList = {
  tokenId: string
  uri: string
}

export const useNftStore = defineStore('nft', () => {
  const nftInfo = ref({ name: '', symbol: '' })
  // nft的销售列表
  const nftList = ref([]) as unknown as NftList[]
  async function getNftList() {
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
  // 添加nft
  async function addNft(uri: string, price: string) {
    if (!contract || !ethereum) return

    const wei = ethers.parseEther(price).toString()
    console.log(uri, wei, 'uri, wei')

    await contract.mintToken('https://baidu.com', wei, {
      value: ethers.parseEther('0.025').toString()
    })
    // return tokenId
  }

  return { nftInfo, nftList, getNftList, addNft }
})
