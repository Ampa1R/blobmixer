import { useUIStore } from '../../../../store'
import Overlay from '../Overlay'

/* Visually looks and behaves like an overlay, but is actually more used like a backdrop */
const DonationInformationOverlay = () => {
  const isOpen = useUIStore((s) => s.donationInformationOpen)
  return (
    <Overlay
      isOpen={isOpen}
      onClose={() => useUIStore.setState(() => ({ donationInformationOpen: false }))}
      variant="web3"
    />
  )
}

export default DonationInformationOverlay
