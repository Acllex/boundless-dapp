import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'
import { N, ethers } from 'ethers'
const { contract, ethereum } = await useWeb3Api()
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
  // 获取nft销售列表
  async function getNftList() {
    if (!contract) return
    nftList.value = []
    const name = await contract.name()
    const symbol = await contract.symbol()
    const nftLists = await contract.getAllNftsOnSale()
    console.log(nftLists, 'nftLists')

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
      await contract.mintToken(uri, wei, {
        value: ethers.parseEther((0.025).toString())
      })
    } catch (error) {
      console.log(error, 'error')
    }
  }
  async function buyNft(tokenId: string, price: string) {
    if (!contract) return
    console.log(tokenId, 'tokenId')

    try {
      await contract
        .buyNft(tokenId, {
          value: ethers.parseEther(price).toString()
        })
        .finally(() => {
          nftList.value = nftList.value.filter((nft) => nft.tokenId !== tokenId)
        })
    } catch (error) {
      console.log(error, 'error')
    }
  }
  return { nftInfo, nftList, getNftList, addNft, buyNft }
})
