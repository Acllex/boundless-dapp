import { Contract, ethers } from 'ethers'
import { NETWORK_ABI, NETWORK_ADDRESS } from '@/utils'

export function useWeb3Api() {
  let provider
  if (window.ethereum === undefined) {
    console.log('请安装metamask')
    return { ethereum: undefined, provider: null, contract: null }
  } else {
    provider = new ethers.BrowserProvider(window.ethereum)
  }
  if (!NETWORK_ABI && !NETWORK_ADDRESS) {
    console.log('Please set NETWORK_ABI and NETWORK_ADDRESS')
    return { ethereum: undefined, provider: null, contract: null }
  }
  const contract = new Contract(NETWORK_ADDRESS, NETWORK_ABI, provider)
  console.log('准备好了')
  return { ethereum: window.ethereum, provider, contract }
}
