import { Contract, ethers } from 'ethers'
import { abi, networks } from '@/assets/NftMarket.json'
import type { NftMarketContract } from '@/type/nftMarketContract'

export function useWeb3Api() {
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
  const contract = new Contract(
    networks['1691497049269'].address,
    abi,
    provider
  ) as unknown as NftMarketContract
  console.log('准备好了')
  return { ethereum: window.ethereum, provider, contract }
}
