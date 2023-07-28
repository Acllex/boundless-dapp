import { ethers } from 'ethers'
import { NETWORK_ABI, NETWORK_ADDRESS } from '@/utils'

export function useWeb3Api() {
  let provider
  if (window.ethereum === undefined) {
    console.log('MetaMask not installed; using read-only defaults')
    return
    // const signer = await provider.getSigner()
    // const accounts = await signer.getAddress()
  } else {
    console.log('Ethereum successfully detected!')
    provider = new ethers.BrowserProvider(window.ethereum)
  }
  if (!NETWORK_ABI && !NETWORK_ADDRESS) {
    console.log('Please set NETWORK_ABI and NETWORK_ADDRESS')
    return
  }
  const contract = new ethers.Contract(NETWORK_ADDRESS, NETWORK_ABI, provider)
  return { ethereum: window.ethereum, provider, contract }
}
