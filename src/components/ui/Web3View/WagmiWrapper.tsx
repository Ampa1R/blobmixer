import '@rainbow-me/rainbowkit/styles.css'
import merge from 'lodash.merge'
import {
  RainbowKitProvider,
  lightTheme,
  connectorsForWallets,
  wallet,
} from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'

import Web3View from './Web3View'

const theme = merge(lightTheme(), {
  colors: {
    accentColor: 'var(--color-grape)',
    actionButtonBorderMobile: 'var(--color-grape)',
    modalTextSecondary: 'rgba(0,0,0,0.6)',
  },
  fonts: {
    body: 'Aften Screen, sans-serif',
  },
  radii: {
    actionButton: '3.125rem',
    modal: '0.5rem',
    modalMobile: '0.5rem',
  },
})

const getChain = () =>
  import.meta.env.REACT_APP_USE_MAINNET === 'true' ? chain.mainnet : chain.goerli

/* Note: In a production app, it is not recommended to only pass publicProvider to configureChains as you will probably face
 * rate-limiting on the public provider endpoints.
 * It is recommended to also pass an alchemyProvider or infuraProvider as well.
 * More information: https://wagmi.sh/docs/getting-started#1-configure-chains
 */
const { chains, provider } = configureChains(
  [getChain()],
  [
    infuraProvider({
      apiKey: import.meta.env.REACT_APP_INFURA_KEY,
      priority: 0,
    }),
    alchemyProvider({
      apiKey: import.meta.env.REACT_APP_RPC_PROVIDER_KEY,
      priority: 1,
    }),
    publicProvider({
      priority: 2,
    }),
  ],
  { pollingInterval: 8_000 }
)

const args = { chains, appName: 'Blobmixer' }

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.metaMask(args),
      wallet.coinbase(args),
      wallet.walletConnect(args),
    ],
  },
])
const wagmiClient = createClient({ connectors, provider })

const WagmiWrapper = () => (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains} modalSize="compact" theme={theme}>
      <Web3View />
    </RainbowKitProvider>
  </WagmiConfig>
)

export default WagmiWrapper
