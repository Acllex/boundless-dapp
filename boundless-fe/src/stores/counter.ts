import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { ethers } from 'ethers'
const provider = new ethers.BrowserProvider(window.ethereum)
if (provider) {
  console.log('Ethereum successfully detected!')
  // const signer = await provider.getSigner()
  // const accounts = await signer.getAddress()
} else {
  console.log(
    'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!'
  )
}
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const web3Api = reactive({
    ethereum: window.ethereum,
    provider: provider
  })
  const doubleCount = computed(() => count.value * 2)

  return { count, doubleCount, web3Api }
})
