import { ethers, Contract } from 'ethers'
import { abi, networks } from '@/content/NftMarket.json'
import type { NftMarketContract } from '@/type/nftMarketContract'
const NETWORK = {
  '1691497049269': 'a'
}
type Networks = typeof NETWORK

const keys = Object.keys(networks) as unknown as (keyof Networks)[]
export async function useWeb3Api() {
  let provider
  if (window.ethereum === undefined) {
    console.log('请安装metamask')
    return { ethereum: undefined, provider: null, contract: null }
  } else {
    provider = new ethers.BrowserProvider(window.ethereum)
  }
  if (!abi && !networks) {
    console.log('Please set abi and networks')
    return { ethereum: undefined, provider: null, contract: null }
  }
  const contract = new ethers.Contract(
    networks[keys[keys.length - 1]]['address'],
    abi,
    provider
  ) as unknown as Contract
  const signer = await provider.getSigner()
  const signedContract = contract.connect(signer)
  console.log('准备好了')
  return {
    ethereum: window.ethereum,
    provider,
    contract: signedContract as unknown as NftMarketContract
  }
}
