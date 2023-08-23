import { ethers, Contract } from 'ethers'
import { abi, networks } from '@/content/NftMarket.json'
import type { NftMarketContract } from '@/types/nftMarketContract'
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
    networks[keys[0]]['address'],
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
// 切换链节点
export async function changeChain() {
  const { ethereum } = await useWeb3Api()
  if (!ethereum) return
  // 切换链节点
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + 'aef3' }]
    })
    return '切换成功！'
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        // 添加链节点
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x' + 'aef3',
              chainName: 'Alfajores Testnet',
              nativeCurrency: {
                name: 'A-CELO',
                symbol: 'A-CELO',
                decimals: 18
              },
              rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
              blockExplorerUrls: ['https://explorer.celo.org/alfajores']
            }
          ]
        })
        return '添加成功！'
      } catch (error: any) {
        console.log(error, 'error')
        return error.message
      }
    } else {
      console.log(error, 'error')
      return error.message
    }
  }
}
