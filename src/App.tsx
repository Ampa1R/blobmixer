import React, {
  useState,
  memo,
  Suspense,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useControl } from 'react-three-gui';

// import { Stats } from '@react-three/drei'
import { Controls, withControls } from 'react-three-gui';
// import { Perf } from 'r3f-perf'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Scene from './components/canvas/Scene.tsx';
import CaptureVideo from './components/canvas/CaptureVideo/CaptureVideo.tsx';
import MyOrbitControls from './components/canvas/MyOrbitControls.tsx';
import PostProcess from './components/canvas/PostProcess.tsx';

import VRButton from './components/ui/VRButton.tsx';
import RemixCTA from './components/ui/RemixCTA/RemixCTA.tsx';
import Gallery from './components/ui/Gallery/Gallery.tsx';
import ExportView from './components/ui/ExportView/ExportView.tsx';
import Web3View from './components/ui/Web3View/Web3View.tsx';
import Remixer from './components/ui/Remixer/Remixer.tsx';
import BackLink from './components/ui/BackLink.tsx';
import AboutOverlay from './components/ui/Overlay/About/About.tsx';
import FaqOverlay from './components/ui/Overlay/Faq/Faq.tsx';
import Loader from './components/ui/Loader.tsx';
import PreviousRoute from './components/ui/PreviousRoute/PreviousRoute.tsx';

import {
  VIDEO_SIZE,
  EXPORT_DPR,
  EXPORT_ANIMATION_DURATION,
} from './lib/config.ts';
import useBreakpoint from './lib/useBreakpoint.tsx';

import { useUIStore, useBlobStore } from './store.ts';
import useQueryState from './useQueryState.ts';
import './App.scss';


const INITIAL_BACKGROUND_COLOR = new THREE.Color('#141518');

// polyfill this way for react-three-gui
(async () => {
  if ('ResizeObserver' in window === false) {
    // Loads polyfill asynchronously, only if required.
    const module = await import('@juggle/resize-observer');
    window.ResizeObserver = module.ResizeObserver;
  }
})();

const CanvasWithControls = withControls(Canvas);

const iconPosition = [0, 0, 0];
const cameraTarget = [0, -0.02, 0];
const cameraTargetExport = [0, 0, 0];
const cameraPosition = [0, iconPosition[1], 0.7];

const AppCanvas = memo(({ onCreated }) => {
  const isRecording = useUIStore((state) => state.isRecording);
  const isExport = useUIStore((state) => state.isExport);
  const mintAnimCardEnded = useUIStore((state) => state.mintAnimCardEnded);
  const previousRoute = useUIStore((state) => state.previousRoute);
  const isDesktop = useBreakpoint('desktop');

  const [postprocess, setPostprocess] = useQueryState('pp', false);
  const [useVideoRecordingSize, setUseVideoRecordingSize] = useState(true);

  const canvasRef = useRef();
  const canvasWrapperRef = useRef();
  const canvasScaleExport = useRef();

  useControl('Postprocess', {
    type: 'boolean',
    state: [postprocess, setPostprocess],
    group: 'Post-processing',
  });

  const setCanvasScale = useCallback(() => {
    if (
      !canvasRef.current ||
      !canvasWrapperRef.current ||
      !canvasScaleExport.current
    )
      return;

    canvasWrapperRef.current.style.width = useVideoRecordingSize
      ? `${VIDEO_SIZE}px`
      : '100%';
    canvasWrapperRef.current.style.height = useVideoRecordingSize
      ? `${VIDEO_SIZE}px`
      : '100%';
    canvasRef.current.style.transform = `scale(${useVideoRecordingSize ? canvasScaleExport.current : 1
      })`;
  }, [useVideoRecordingSize]);

  // to be used in Export page
  const calculateCanvasScale = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const minSize = Math.min(width, height);
    const sizePercentage = isDesktop ? 70 : 100;
    const size = (minSize * sizePercentage) / 100;

    canvasScaleExport.current = size / VIDEO_SIZE;

    setCanvasScale();
  }, [isDesktop, setCanvasScale]);

  useEffect(() => {
    useUIStore.setState(() => ({ isPostProccessing: postprocess }));
  }, [postprocess]);

  useEffect(() => {
    canvasWrapperRef.current = document.querySelector('.AppCanvasWrapper');
    canvasRef.current = document.querySelector('.AppCanvasWrapper canvas');

    calculateCanvasScale();

    window.addEventListener('resize', calculateCanvasScale);

    return () => {
      window.removeEventListener('resize', calculateCanvasScale);
    };
  }, [calculateCanvasScale]);

  useEffect(() => {
    if (isExport || previousRoute === '/export') {
      canvasRef.current.style.animation = 'none';

      window.requestAnimationFrame(() => {
        canvasRef.current.style.animation = `fadeOutIn ${EXPORT_ANIMATION_DURATION}ms linear`;
      });

      // time for the blob to fade out (30% of the animation)
      setTimeout(() => {
        setUseVideoRecordingSize(isExport);
      }, (EXPORT_ANIMATION_DURATION * 30) / 100);
    } else {
      canvasRef.current.style.animation = 'none';

      setUseVideoRecordingSize(false);
    }
  }, [isExport, previousRoute]);

  return (
    <CanvasWithControls
      foveation={1} // for faster VR rendering (lower resolution at screen edge)
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, isExport ? EXPORT_DPR : 1.6]}
      raycaster={{ enabled: false }}
      camera={{
        fov: 40,
        near: 0.1,
        position: cameraPosition,
        zoom: 1,
      }}
      onCreated={({ gl, ...props }) => {
        gl.debug.checkShaderErrors = false;
        gl.setClearColor(INITIAL_BACKGROUND_COLOR, 1.0);

        onCreated({ gl, ...props });

        setTimeout(() => {
          gl.domElement.parentNode.parentNode.style.opacity = 1;
        }, 0);
      }}
      style={{
        opacity: 0,
      }}
    >
      <Suspense fallback={null}>
        <Scene center={iconPosition} />

        <MyOrbitControls
          target={
            isExport || mintAnimCardEnded ? cameraTargetExport : cameraTarget
          }
          cameraPosition={cameraPosition}
        />

        <Environment files="peppermint_powerplant_1k.hdr" />
      </Suspense>

      {postprocess && <PostProcess />}

      {isRecording && (
        <CaptureVideo
          onProgress={(recordingProgress) => {
            useUIStore.setState(() => ({ recordingProgress }));
          }}
          onCaptured={({ url, blob }) => {
            useUIStore.setState(() => ({
              videoBlob: blob,
              videoBlobUrl: url,
              isRecording: false,
            }));
          }}
          hasPostProcessing={postprocess}
        />
      )}

      {/* { showFPS && (
        <Stats/>
      )} */}
      {/* <Perf /> */}


    </CanvasWithControls>
  );
});

function App() {
  const showControls = useUIStore((s) => s.showControls);
  const web3App = useUIStore((s) => s.web3App);
  const [gl, setGL] = useState();

  const isAboutOpen = useUIStore((s) => s.aboutOpen);
  const hideAboutButton = useUIStore((s) => s.hideAboutButton);
  const donationInformationOpen = useUIStore((s) => s.donationInformationOpen);
  const isFaqOpen = useUIStore((s) => s.faqOpen);
  const isNftsAvailabeOpen = useUIStore((s) => s.nftsAvailabeOpen);
  const hideNFTCollectionLinkOnMobile = useUIStore(
    (s) => s.hideNFTCollectionLinkOnMobile
  );
  const clearColor = useUIStore((state) => state.clearColor);
  const isGallery = useUIStore((state) => state.isGallery);
  const isRemix = useUIStore((state) => state.isRemix);
  const isWeb3 = useUIStore((state) => state.isWeb3);
  const mintAnimCardEnded = useUIStore((state) => state.mintAnimCardEnded);
  const isExport = useUIStore((state) => state.isExport);
  const isEmbedMode = !!useBlobStore.getState().embed;

  return (
    <div className="App" style={{ backgroundColor: clearColor }}>
      <Controls.Provider>
        <div className="AppCanvasWrapper">
          <AppCanvas onCreated={({ gl }) => setGL(gl)} />
        </div>

        <div className={'AppUI ' + (isAboutOpen ? 'hidden' : '')}>
          <Router>
            <Routes>
              <Route path="/remix" element={<Remixer />} />
              <Route
                path="/view"
                element={!isEmbedMode && <RemixCTA align="right" />}
              />
              <Route path="/about" element={<Gallery />} />
              <Route path={'/export'} element={<ExportView />} />
              {web3App && <Route path={'/web3'} element={<Web3View />} />}
              <Route path="/" element={<Gallery />} />
            </Routes>
            <PreviousRoute />
            {!isEmbedMode && <BackLink />}
            {!isAboutOpen &&
              !isEmbedMode &&
              !hideAboutButton &&
              !isRemix &&
              !isWeb3 && (
                <button
                  href="#"
                  className="AboutFaqLink"
                  onClick={() => useUIStore.setState(() => ({ aboutOpen: true }))}
                >
                  About
                </button>
              )}
            {!isFaqOpen &&
              (isRemix || isWeb3) &&
              !donationInformationOpen &&
              !(isWeb3 && mintAnimCardEnded) && (
                <button
                  href="#"
                  className="AboutFaqLink"
                  onClick={() => useUIStore.setState(() => ({ faqOpen: true }))}
                >
                  FAQ
                </button>
              )}
            <a
              href={import.meta.env.REACT_APP_OPEN_SEA_COLLECTION_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={`NFTCollectionLink ${hideNFTCollectionLinkOnMobile ? 'hideOnMobile' : ''
                }`}
            >
              {!isEmbedMode && !isExport && !(isWeb3 && mintAnimCardEnded) && (
                <span>NFT Collection</span>
              )}
            </a>
          </Router>

          {!isEmbedMode && isGallery && <VRButton gl={gl} />}
        </div>

        <AboutOverlay />
        <FaqOverlay />

        {showControls && !isAboutOpen && !isFaqOpen && !isNftsAvailabeOpen && (
          <Controls
            title="Blob Mixer"
            collapsed={false}
            anchor={'bottom_right'}
            defaultClosedGroups={[
              'Renderer',
              'Lights',
              'Blob Material',
              'Blob Noise',
              'Blob Surface Noise',
              'Blob Geometry',
              'Environment',
              'Floor',
              'Spotlight#1',
              'Spotlight#2',
              'Spotlight#3',
              'Spotlight#4',
              'Spotlight#5',
              'Camera',
              'Post-processing',
            ]}
            style={{
              maxHeight: 'min(90vh, 80vw)',
              borderRadius: '0px',
              background: '#000',
              color: '#fff',
              fontFamily: 'Aften Screen',
            }}
            className="GUI"
          />
        )}
      </Controls.Provider>
      <Loader />
    </div>
  );
}

export default App;
