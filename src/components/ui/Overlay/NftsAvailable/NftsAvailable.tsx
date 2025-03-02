import { useUIStore } from '../../../../store'
import Overlay from '../Overlay'

const formatFinalDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return `${date.toLocaleString('en-US', {
    month: 'long',
  })} ${date.getDate()}, ${date.getFullYear()}`
}

const NftsAvailableOverlay = ({ finalMintTimestamp }) => {
  const isOpen = useUIStore((s) => s.nftsAvailabeOpen)

  return (
    <Overlay
      onClose={() => useUIStore.setState(() => ({ nftsAvailabeOpen: false }))}
      variant="web3"
      isOpen={isOpen}
    >
      <p>
        On December 14, 2022, we launched the Blobmixer with features for owning
        a blob as NFTs. In total, {import.meta.env.REACT_APP_MAX_NUMBER_OF_TOKENS}{' '}
        blobs were minted by users, and profits were donated to a charitable
        cause via The Giving Block.
        {finalMintTimestamp !== 0 && (
          <span>
            The NFT collection reached the max limit on{' '}
            {formatFinalDate(finalMintTimestamp)}, and all the blobs found their
            owner to improve the world.
          </span>
        )}
      </p>
    </Overlay>
  )
}

export default NftsAvailableOverlay
