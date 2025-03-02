import { useUIStore } from '../../../../store'

import s from './About.module.scss'
import Overlay from '../Overlay'

const Link = ({ href, children }) => (
  <a className={s.link} href={href} target="_blank" rel="noreferrer noopener">
    {children}
  </a>
)

const ExtLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer noopener" data-external>
    {children}
  </a>
)

const AboutOverlay = () => {
  const isOpen = useUIStore((s) => s.aboutOpen)

  return (
    <Overlay
      onClose={() => useUIStore.setState(() => ({ aboutOpen: false }))}
      isOpen={isOpen}
      innerClassName={s.container}
    >
      <div>
        <p className={s.header}>
          This website is a copy of <Link href="https://blobmixer.14islands.com/">Blobmixer</Link>. You can find source code at <Link href="https://github.com/Ampa1R/blobmixer">GitHub</Link>.
          <br />
        </p>
        <p className={s.mediumBody}>
          The Blobmixer is a toy for creating 3D art; own it as a video, view it
          in VR, or share it with friends. In total, 1414 pieces will be minted
          and become part of our{' '}
          <Link href={import.meta.env.REACT_APP_OPEN_SEA_COLLECTION_URL}>
            NFT collection
          </Link>
          , whose profits will be donated to charity via{' '}
          <Link href="https://thegivingblock.com/">The Giving Block</Link>.{' '}
        </p>
        <p className={s.mediumBody}>
          The Blobmixer was born with the{' '}
          <Link href="https://14islands.com">14islands</Link> brand as an
          abstraction of islands surrounded by water. Blobs are never perfectly
          round and always changing shapes, like islands that change with tides
          and waves.
        </p>
      </div>
      <p className={s.details}>
        Built using <ExtLink href="https://threejs.org/">three</ExtLink>,{' '}
        <ExtLink href="https://github.com/pmndrs/react-three-fiber">
          @react-three/fiber
        </ExtLink>
        , <ExtLink href="https://www.react-spring.io/">react-spring</ExtLink>,{' '}
        <ExtLink href="https://use-gesture.netlify.app/">
          @use-gesture/react
        </ExtLink>
        ,{' '}
        <ExtLink href="https://github.com/pmndrs/drei">
          @react-three/drei
        </ExtLink>
        ,{' '}
        <ExtLink href="https://github.com/protectwise/troika/tree/master/packages/troika-three-text">
          troika-three-text
        </ExtLink>
        ,{' '}
        <ExtLink href="https://github.com/pmndrs/react-xr">
          @react-three/xr
        </ExtLink>
        ,{' '}
        <ExtLink href="https://github.com/birkir/react-three-gui">
          react-three-gui
        </ExtLink>
        ,{' '}
        <ExtLink href="https://github.com/pmndrs/react-postprocessing">
          @react-three/postprocessing
        </ExtLink>
        ,{' '}
        <ExtLink href="https://github.com/RenaudRohlinger/r3f-perf">
          r3f-perf
        </ExtLink>
        , <ExtLink href="https://github.com/pmndrs/zustand">zustand</ExtLink>.
        Environment map photo by{' '}
        <ExtLink href="http://www.flickr.com/photos/jonragnarsson/2294472375/">
          Jón Ragnarsson
        </ExtLink>
        . Thank you all 💜{' '}
        <a
          className={s.licence}
          target="_blank"
          rel="license noreferrer noopener"
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        >
          <img
            alt="Creative Commons License"
            style={{ borderWidth: 0 }}
            src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png"
          />
        </a>
      </p>
    </Overlay>
  )
}

export default AboutOverlay
