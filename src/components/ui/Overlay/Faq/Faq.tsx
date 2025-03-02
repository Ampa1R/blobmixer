import { useUIStore } from '../../../../store'
import Overlay from '../Overlay'
import s from './Faq.module.scss'

const Link = ({ href, children }) => (
  <a className={s.link} href={href} target="_blank" rel="noreferrer noopener">
    {children}
  </a>
)

const FaqOverlay = () => {
  const isOpen = useUIStore((s) => s.faqOpen)

  return (
    <Overlay
      onClose={() => useUIStore.setState(() => ({ faqOpen: false }))}
      className={s.content}
      variant="web3"
      isOpen={isOpen}
    >
      <h3 className={s.mediumBody}>Why NFTs?</h3>
      <p className={s.smallBody}>
        Every blob you create has its own unique identity. By utilizing the
        power of NFTs (non-fungible tokens), your favorite blobs can become
        unique digital video assets that are yours to keep and show to the
        world.
      </p>

      <h3 className={s.mediumBody}>What do I need?</h3>
      <p className={s.smallBody}>
        To mint a blob, you’ll need {import.meta.env.REACT_APP_MIN_DONATION_VALUE}{' '}
        ETH (+ gas fees) on an Ethereum crypto wallet. Learn more about how to
        find a wallet or how to buy ETH on the Ethereum website.
      </p>

      <h3 className={s.mediumBody}>Where does my money go?</h3>
      <p className={s.smallBody}>
        The total amount you pay for each blob is automatically donated to the{' '}
        <Link href="https://thegivingblock.com/campaigns/ukraine-emergency-response-fund/">
          Ukraine Emergency Response Fund
        </Link>{' '}
        via The Giving Block. All donations are handled by smart contracts,
        which allow your money to go directly to the fund without any
        intermediator. This way, you can be sure that your full contribution
        goes to a good cause.
      </p>
      <h3 className={s.mediumBody}>Why should I pay for a digital blob?</h3>
      <p className={s.smallBody}>
        By minting your unique blob, you become its official owner. Apart from
        donating to a good cause, this lets you show your blob to the world and
        resell it however you wish. You will also be able to download a
        high-quality video loop of your blob once you own it. A total of 1414
        blob NFTs will ever be minted, so be sure to get yours before it’s too
        late.
      </p>
    </Overlay>
  )
}

export default FaqOverlay
