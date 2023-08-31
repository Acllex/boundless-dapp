import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ethers } from 'ethers'
import { ElMessage } from 'element-plus'
import {
  getAllNftsOnSale,
  tokenURI,
  getOwner,
  getOwnedNfts,
  mintToken,
  buyMyNft,
  placeMyNftOnSale,
  cancelMyNftOnSale
} from '@/server/web3api'
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
  // 提醒信息
  const nftMessage = ref('')

  // 获取nft销售列表
  async function getNftList() {
    nftList.value = []
    nftLoading.value = true
    try {
      const nftLists = await getAllNftsOnSale()
      const nfts = [] as NftItem[]
      for (let i = 0; i < nftLists.length; i++) {
        const nft = nftLists[i]
        const uri = await tokenURI(nft.tokenId.toString())
        const owner = await getOwner(nft.tokenId.toString())
        const nftJson = await (await fetch(uri)).json()
        nfts.push({
          tokenId: nft.tokenId.toString(),
          owner,
          price: ethers.formatEther(nft.price.toString()),
          ...nftJson
        })
      }
      nftList.value = nfts
    } catch (error) {
      console.log(error, 'error')
      nftMessage.value = '当前区块链没有Boundless NFT合约,请切换区块链'
    }
    // nftInfo.value = { name, symbol }
    nftLoading.value = false
  }
  // 获取nft个人列表
  async function getNftMyList(address: `0x${string}`) {
    nftLoading.value = true
    nftMyList.value = []
    try {
      const nftLists = await getOwnedNfts(address)
      for (let i = 0; i < nftLists.length; i++) {
        const nft = nftLists[i]
        const uri = await tokenURI(nft.tokenId.toString())
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
      nftMessage.value = '当前区块链没有Boundless NFT合约,请切换区块链'
    }
    nftLoading.value = false
  }
  // 创造nft
  async function addNft(uri: string, price: string) {
    try {
      const res = await mintToken(uri, price)
      return res
    } catch (error) {
      console.log(error, 'error')
    }
  }
  // 购买nft
  async function buyNft(tokenId: string, price: string) {
    try {
      await buyMyNft(tokenId, price).then(() => {
        nftList.value = nftList.value.filter((nft) => nft.tokenId !== tokenId)
      })
    } catch (error: any) {
      console.log(error, 'error')
      ElMessage.error(error.name)
    }
  }
  // 挂卖nft
  async function placeNftOnSale(tokenId: string, price: string) {
    try {
      const res = await placeMyNftOnSale(tokenId, price)
      return res
    } catch (error) {
      console.log(error, 'error')
    }
  }
  // 取消挂卖nft
  async function cancelNftOnSale(tokenId: string) {
    try {
      await cancelMyNftOnSale(tokenId)
    } catch (error) {
      console.log(error, 'error')
    }
  }
  // 获取TokenURI
  async function getTokenURI(tokenId: string) {
    try {
      const uri = await tokenURI(tokenId)
      return uri
    } catch (error) {
      console.log(error, 'error')
    }
  }
  return {
    nftLoading,
    nftMessage,
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
