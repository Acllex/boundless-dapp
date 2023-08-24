import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig } from '@wagmi/core'
import { celoAlfajores } from '@wagmi/core/chains'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
const chains = [celoAlfajores]

const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId: import.meta.env.VITE_PROJECT_ID })
])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId: import.meta.env.VITE_PROJECT_ID, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)
const web3modal = new Web3Modal(
  { projectId: import.meta.env.VITE_PROJECT_ID, defaultChain: celoAlfajores },
  ethereumClient
)
app.config.globalProperties.$web3modal = web3modal
app.mount('#app')
