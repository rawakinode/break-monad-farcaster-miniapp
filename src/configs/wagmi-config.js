import { http, createConfig } from '@wagmi/vue'
import { monadTestnet } from '@wagmi/vue/chains'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
 
export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [
    farcasterFrame()
  ]
})