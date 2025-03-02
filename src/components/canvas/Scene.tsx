import { useRef, useEffect, useState } from 'react';
import { Color, MathUtils } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useControl } from 'react-three-gui';
import { useSpring } from '@react-spring/three';

import { useUIStore } from '../../store';
import useQueryState from '../../useQueryState';

import Lights from './Lights.tsx';
import Blob from './Blob/Blob.tsx';
import TextCarousel /*, { TextTitle }*/ from './TextCarousel/TextCarousel.tsx';

// const CustomTitle = ({ y, visible }) => {
//   const [customTitle, setCustomTitle] = useQueryState('title', 'Your title')

//   useControl('Title', {
//     type: 'string',
//     state: [customTitle, setCustomTitle],
//     group: '',
//   })

//   return <TextTitle y={y} title={customTitle} standalone enabled={visible} />
// }

const bgColor = new Color();

export default function Scene({ center, enableShadowMap }) {
  const blob = useRef();
  const textCarousel = useRef();
  const { gl, size } = useThree();
  const local = useRef({
    currentPageUnlimited: useUIStore.getState().currentPageUnlimited,
    currentPageFactor: useUIStore.getState().currentPageFactor,
    mouse: useUIStore.getState().mouse,
    vx: 0,
  }).current;

  const isGallery = useUIStore((s) => s.isGallery);
  const isAboutOpen = useUIStore((s) => s.aboutOpen);
  const isExport = useUIStore((state) => state.isExport);

  const notLoadedBg = '#141518';
  const [isLoaded, setLoaded] = useState(false);

  const [clearColor, setClearColor] = useQueryState('clearColor', '#657174');

  useControl('Background color', {
    type: 'color',
    state: [clearColor, setClearColor],
    group: 'Environment',
  });

  useSpring({
    clearColor: isAboutOpen ? '#141518' : isLoaded ? clearColor : notLoadedBg,
    config: { tension: 50, friction: 10, clamp: true },
    onChange: ({ value: { clearColor } }) => {
      bgColor.setStyle(clearColor);
      gl.setClearColor(bgColor.convertLinearToSRGB(), 1.0);
    },
  });

  // Change theme color according to background color
  useEffect(() => {
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute('content', clearColor);
  }, [clearColor]);

  useEffect(() => {
    gl.setClearColor(notLoadedBg, 1.0);
    setLoaded(true);
  }, [gl]);

  useEffect(() => {
    useUIStore.setState(() => ({ clearColor }));
  }, [clearColor]);

  useEffect(
    () =>
      useUIStore.subscribe(
        ({ currentPageUnlimited, currentPageFactor, mouse, vx }) => {
          local.currentPageUnlimited = currentPageUnlimited;
          local.currentPageFactor = currentPageFactor;
          local.mouse = mouse;
          local.vx = vx;
        }
      ),
    [local]
  );

  useFrame(() => {
    if (!blob.current) return;

    if (isExport) return;

    const turns =
      2 *
      Math.PI *
      (local.currentPageUnlimited +
        (!isGallery ? 1 : 0) +
        (isAboutOpen ? 0.5 : 0));

    const parallax = Math.PI;
    let rot = -turns;
    let blobX = 0;
    // let blobY = center[1]

    const mouseLerp = 0.05;
    const scrollLerp = 0.033;
    const mouseParallax = 0.01;

    if (isGallery) {
      const pageDist =
        local.currentPageFactor < 0
          ? 1 + local.currentPageFactor
          : local.currentPageFactor;

      rot = parallax * 0.5 - pageDist * parallax - turns;

      // send parallax to inner components
      useUIStore.setState(() => ({ textParallax: -local.mouse.x * mouseParallax }));

      textCarousel.current.position.y = MathUtils.lerp(
        textCarousel.current.position.y,
        local.mouse.y * mouseParallax,
        mouseLerp
      );

      blobX =
        local.mouse.x * -mouseParallax * 0.5 -
        MathUtils.clamp(local.vx, -0.1, 0.1);
      // blobY += local.mouse.y * mouseParallax * 0.5
    }

    blob.current.position.x = MathUtils.lerp(
      blob.current.position.x,
      blobX,
      mouseLerp
    );

    // disable y parallax - interferes with responsive position
    // blob.current.position.y = MathUtils.lerp(blob.current.position.y, blobY, mouseLerp)

    blob.current.rotation.y = MathUtils.lerp(
      blob.current.rotation.y,
      rot,
      scrollLerp
    );
  });

  // const isVR = useUIStore((s) => s.isVR)
  const isPortrait = size.height > size.width;
  const blobPos = [
    center[0],
    center[1], // + (isPortrait ? 0.0 : 0),
    center[2], // + isVR ? -0.7 : 0,
  ];
  const textY = center[1] + (isPortrait ? 0.14 : 0);

  return (
    <>
      <Blob ref={blob} position={blobPos} enableShadow={enableShadowMap} />

      <TextCarousel
        ref={textCarousel}
        y={textY}
        visible={!isAboutOpen && isGallery}
        getVelocity={(v) => console.log(v)}
      />

      <Lights target={blob} position={blobPos} />

      {/* <CustomTitle y={textY} visible={!isAboutOpen && !isGallery} /> */}
    </>
  );
}
