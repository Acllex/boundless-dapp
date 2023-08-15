import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'
import { ethers } from 'ethers'
const { contract, ethereum, provider } = await useWeb3Api()
type NftItem = {
  tokenId: string
  name: string
  description: string
  image: string
  price: string
}

export const useNftStore = defineStore('nft', () => {
  const nftInfo = ref({ name: '', symbol: '' })
  // nft的销售列表
  const nftList = ref([] as NftItem[])
  async function getNftList() {
    if (!contract) return
    const name = await contract.name()
    const symbol = await contract.symbol()
    const nftLists = await contract.getAllNftsOnSale()

    nftLists.forEach(async (nft) => {
      const uri = await contract.tokenURI(nft.tokenId.toString())
      const nftJson = await (await fetch(uri)).json()
      nftList.value.push({
        tokenId: nft.tokenId.toString(),
        price: ethers.formatEther(nft.price.toString()),
        ...nftJson
      })
    })
    nftInfo.value = { name, symbol }
  }
  // 添加nft
  async function addNft(uri: string, price: string) {
    if (!contract || !ethereum) return
    const wei = ethers.parseEther(price)
    try {
      const tx = await contract.mintToken(uri, wei, {
        value: ethers.parseEther((0.025).toString())
      })
      console.log(tx, 'tx')
    } catch (error) {
      console.log(error, 'error')
    }
  }
  onMounted(() => {
    getNftList()
  })
  return { nftInfo, nftList, getNftList, addNft }
})
