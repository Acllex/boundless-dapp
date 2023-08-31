import {
  getContract,
  readContract,
  prepareWriteContract,
  writeContract,
  getWalletClient
} from '@wagmi/core'
import { abi, networks } from '@/content/NftMarket.json'
import { parseEther } from 'viem'
const NETWORK = {
  '1691497049269': 'a'
}
type Networks = typeof NETWORK
const keys = Object.keys(networks) as unknown as (keyof Networks)[]

export function getMyContract() {
  const contract = getContract({
    address: networks[keys[0]]['address'] as `0x${string}`,
    abi: abi
  })
  return contract
}
export async function getAllNftsOnSale() {
  const data = await readContract({
    address: networks[keys[0]]['address'] as `0x${string}`,
    abi: abi,
    functionName: 'getAllNftsOnSale'
  })
  return data as { [key: string]: any }[]
}
export async function tokenURI(tokenId: string) {
  const data = await readContract({
    address: networks[keys[0]]['address'] as `0x${string}`,
    abi: abi,
    functionName: 'tokenURI',
    args: [tokenId]
  })
  return data as string
}
export async function getOwner(tokenId: string) {
  const data = await readContract({
    address: networks[keys[0]]['address'] as `0x${string}`,
    abi: abi,
    functionName: 'ownerOf',
    args: [tokenId]
  })
  return data as string
}
export async function getOwnedNfts(address: `0x${string}`) {
  const data = await readContract({
    address: networks[keys[0]]['address'] as `0x${string}`,
    abi: abi,
    functionName: 'getOwnedNfts',
    account: {
      address: address,
      type: 'json-rpc'
    }
  })
  return data as { [key: string]: any }[]
}
export async function mintToken(uri: string, price: string) {
  const { request } = await prepareWriteContract({
    address: networks[keys[0]]['address'] as `0x${string}`,
    abi: abi,
    functionName: 'mintToken',
    chainId: 44787,
    args: [uri, parseEther(price)],
    value: parseEther('0.025')
  })
  const { hash } = await writeContract(request)
  return hash
}
// 购买nft
export async function buyMyNft(tokenId: string, price: string) {
  const { request } = await prepareWriteContract({
    address: networks[keys[0]]['address'] as `0x${string}`,
    abi: abi,
    functionName: 'buyNft',
    chainId: 44787,
    args: [tokenId],
    value: parseEther(price)
  })
  const { hash } = await writeContract(request)
  return hash
}
// 挂卖nft
export async function placeMyNftOnSale(tokenId: string, price: string) {
  const { request } = await prepareWriteContract({
    address: networks[keys[0]]['address'] as `0x${string}`,
    abi: abi,
    functionName: 'placeNftOnSale',
    chainId: 44787,
    args: [tokenId, parseEther(price)],
    value: parseEther('0.025')
  })
  const { hash } = await writeContract(request)
  return hash
}
// 取消挂卖nft
export async function cancelMyNftOnSale(tokenId: string) {
  const { request } = await prepareWriteContract({
    address: networks[keys[0]]['address'] as `0x${string}`,
    abi: abi,
    functionName: 'cancelNftOnSale',
    chainId: 44787,
    args: [tokenId]
  })
  const { hash } = await writeContract(request)
  return hash
}
