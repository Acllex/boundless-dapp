import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Api } from '@/utils'
import { ethers } from 'ethers'
const { contract, ethereum } = await useWeb3Api()
type Combat = {
  attack: string
  defense: string
  speed: string
  health: string
}
type NftItem = {
  tokenId: string
  owner: string
  name: string
  isListed: boolean
  description: string
  image: string
  price: string
  combat?: Combat
}

export const useNftStore = defineStore('nft', () => {
  const nftLoading = ref(false)
  // const nftInfo = ref({ name: '', symbol: '' })
  // nft的销售列表
  const nftList = ref([] as NftItem[])
  // nft个人列表
  const nftMyList = ref([] as NftItem[])
  // 获取nft销售列表
  async function getNftList() {
    if (!contract) return
    nftList.value = []
    nftLoading.value = true
    // const name = await contract.name()
    // const symbol = await contract.symbol()
    const nftLists = await contract.getAllNftsOnSale()

    for (let i = 0; i < nftLists.length; i++) {
      const nft = nftLists[i]
      const uri = await contract.tokenURI(nft.tokenId.toString())
      const owner = await contract.ownerOf(nft.tokenId.toString())
      const nftJson = await (await fetch(uri)).json()
      nftList.value.push({
        tokenId: nft.tokenId.toString(),
        owner,
        price: ethers.formatEther(nft.price.toString()),
        ...nftJson
      })
    }

    // nftInfo.value = { name, symbol }
    nftLoading.value = false
  }
  // 获取nft个人列表
  async function getNftMyList() {
    if (!contract) return
    nftLoading.value = true
    nftMyList.value = []
    try {
      const nftLists = await contract.getOwnedNfts()
      for (let i = 0; i < nftLists.length; i++) {
        const nft = nftLists[i]
        const uri = await contract.tokenURI(nft.tokenId.toString())
        const nftJson = await (await fetch(uri)).json()
        nftMyList.value.push({
          tokenId: nft.tokenId.toString(),
          isListed: nft.isListed,
          price: ethers.formatEther(nft.price.toString()),
          ...nftJson
        })
      }
    } catch (error) {
      console.log(error, 'error')
    }
    nftLoading.value = false
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
  // 购买nft
  async function buyNft(tokenId: string, price: string) {
    if (!contract) return

    try {
      await contract
        .buyNft(tokenId, {
          value: ethers.parseEther(price).toString()
        })
        .then(() => {
          nftList.value = nftList.value.filter((nft) => nft.tokenId !== tokenId)
        })
    } catch (error) {
      console.log(error, 'error')
    }
  }
  // 挂卖nft
  async function placeNftOnSale(tokenId: string, price: string) {
    if (!contract) return
    try {
      await contract.placeNftOnSale(tokenId, ethers.parseEther(price).toString(), {
        value: ethers.parseEther((0.025).toString())
      })
    } catch (error) {
      console.log(error, 'error')
    }
  }
  // 取消挂卖nft
  async function cancelNftOnSale(tokenId: string) {
    if (!contract) return
    try {
      await contract.cancelNftOnSale(tokenId)
    } catch (error) {
      console.log(error, 'error')
    }
  }
  // 获取TokenURI
  async function getTokenURI(tokenId: string) {
    if (!contract) return
    try {
      const uri = await contract.tokenURI(tokenId)
      return uri
    } catch (error) {
      console.log(error, 'error')
    }
  }
  return {
    nftLoading,
    // nftInfo,
    nftList,
    nftMyList,
    getNftList,
    addNft,
    buyNft,
    getNftMyList,
    placeNftOnSale,
    cancelNftOnSale,
    getTokenURI
  }
})
