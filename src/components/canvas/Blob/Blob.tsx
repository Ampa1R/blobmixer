import { forwardRef, useRef, useState, useEffect, useMemo } from 'react';
import { useTexture, Sphere } from '@react-three/drei';
import { Vector3, Quaternion } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useControl } from 'react-three-gui';
import { a, useSpring } from '@react-spring/three';
import { mergeRefs} from 'react-merge-refs';

// Local components
import MagicalMaterial from './MagicalMaterial';
import DebugMaterialControls from './DebugMaterialControls';

import useQueryState from '../../../useQueryState';
import { useUIStore } from '../../../store';

const AnimatedMagicalMaterial = a(MagicalMaterial);

/**
 * Blob
 * The debug controls have been intentionally left in place to allow for easy inspection of how the materials are configured.
 *
 * @param {bool} darkTheme Theme selection
 * @param {object} ref React ref from forwardRef
 */
function Blob({ enableShadow, position, ...props }, ref) {
  const material = useRef();
  const blob = useRef();
  const geom = useRef();
  const grabTarget = useRef();
  const { size } = useThree();
  const isRemix = useUIStore((s) => s.isRemix);
  const isExport = useUIStore((s) => s.isExport);
  const isWeb3 = useUIStore((s) => s.isWeb3);
  const isAboutOpen = useUIStore((s) => s.aboutOpen);
  const successfulMintSceneScale = useUIStore(
    (s) => s.successfulMintSceneScale
  );
  const mintAnimCardEnded = useUIStore((s) => s.mintAnimCardEnded);
  const isPortrait = size.height > size.width;

  const firstLoad = useRef(true);
  const [showAllMaterial, setShowAllMaterial] = useState(false);

  // delay transmission and envMapIntensity on initial load
  useEffect(() => {
    let timer;
    if (firstLoad.current)
      timer = setTimeout(() => setShowAllMaterial(true), 500);
    else setShowAllMaterial(true);

    firstLoad.current = false;
    return () => clearTimeout(timer);
  }, []);

  // resources
  const globalPos = useMemo(() => new Vector3(), []);
  const globalQuaternion = useMemo(() => new Quaternion(), []);

  // const [envMapEq] = useTexture([envMapSrc])
  const gradients = useTexture([
    './gradients/media_02_gradient-primary-variation.png',
    './gradients/media_03_gradient-secondary.png',
    './gradients/media_04_gradient-error.png',
    './gradients/media_05_gradient-alert.png',
    './gradients/media_06_cosmic-fusion.png',
    './gradients/media_07_deep-ocean.png',
    './gradients/media_08_lucky-day.png',
    './gradients/media_09_sunset-vibes.png',
    './gradients/media_10_cd.png',
    './gradients/media_11_foil.png',
    './gradients/media_12_halloween.png',
    './gradients/media_13_hollogram.png',
    './gradients/media_14_imaginarium.png',
    './gradients/media_15_iridescent.png',
    './gradients/media_16_pink-floyd.png',
    './gradients/media_17_sirens.png',
    './gradients/media_18_synthwave.png',
  ]);

  const [loaded, setLoaded] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);

  // MATERIAL PROPERTIES
  const presenceMaterialProps = {
    roughness: useQueryState('roughness', 0.14),
    metalness: useQueryState('metalness', 0),
    envMapIntensity: useQueryState('envMap', 1),
    clearcoat: useQueryState('clearcoat', 1),
    clearcoatRoughness: useQueryState('ccRougness', 0.7),
    transmission: useQueryState('transmission', 0.0),
    // ior: useQueryState('ior', 1.0),
    // reflectivity: useQueryState('reflectivity', 0.5),
    opacity: useQueryState('opacity', 1),
    color: useQueryState('color', '#fff'),
    flatShading: useQueryState('flatShading', false),
    wireframe: useQueryState('wireframe', false),
    useGradient: useQueryState('useGradient', true), // smoother transition if always a texture
  };

  // const [floorVisible, setFloorVisible] = useQueryState('floor', false);
  // const [floorSize, setFloorSize] = useQueryState('floorSize', 1);
  // const [floorColor, setFloorColor] = useQueryState('floorColor', '#000');
  // const [floorOpacity, setFloorOpacity] = useQueryState('floorOpacity', 0.1);
  // const [floorRoughness, setFloorRoughness] = useQueryState('floorRoughness', 0.5);
  // const [floorMetalness, setFloorMetalness] = useQueryState('floorMetalness', 0.5);
  // const [floorEnvMap, setFloorEnvMap] = useQueryState('floorEnvMap', 0.2);
  // const [floorY, setFloorY] = useQueryState('floorY', 0);

  // useControl('Floor visible', { type: 'boolean', state: [floorVisible, setFloorVisible], group: 'Floor' });
  // useControl('Floor size', { type: 'number', state: [floorSize, setFloorSize], min: 0, max: 5, group: 'Floor' });
  // useControl('Floor color', { type: 'color', state: [floorColor, c => setFloorColor(rgba(c))], group: 'Floor', inline: true });
  // useControl('Floor opacity', { type: 'number', state: [floorOpacity, setFloorOpacity], min: 0, max: 1, group: 'Floor' });
  // useControl('Floor roughness', { type: 'number', state: [floorRoughness, setFloorRoughness], min: 0, max: 1, group: 'Floor' });
  // useControl('Floor metalness', { type: 'number', state: [floorMetalness, setFloorMetalness], min: 0, max: 1, group: 'Floor' });
  // useControl('Floor envMap', { type: 'number', state: [floorEnvMap, setFloorEnvMap], min: 0, max: 1, group: 'Floor' });
  // useControl('Floor Y', { type: 'number', state: [floorY, setFloorY], min: -10, max: 2, group: 'Floor' });

  // NOISE STATE / PROPS
  const [distort, setDistort] = useQueryState('distort', 0.5);
  const [frequency, setFrequency] = useQueryState('frequency', 1.5);
  const [speed, setSpeed] = useQueryState('speed', 1);
  const [gooPoleAmount, setGooPoleAmount] = useQueryState('poleAmount', 1);
  useControl('Distort', {
    type: 'number',
    state: [distort, setDistort],
    min: 0.0,
    max: 1.0,
    group: 'Blob Noise',
  });
  useControl('Frequency', {
    type: 'number',
    state: [frequency, setFrequency],
    min: 0.01,
    max: 5,
    group: 'Blob Noise',
  });
  useControl('Speed', {
    type: 'number',
    state: [speed, setSpeed],
    min: 0,
    max: 10,
    step: 1,
    group: 'Blob Noise',
  });
  useControl('Pole amount', {
    type: 'number',
    state: [gooPoleAmount, setGooPoleAmount],
    min: 0,
    max: 1,
    group: 'Blob Noise',
  });

  const [surfaceDistort, setSurfaceDistort] = useQueryState(
    'surfaceDistort',
    1
  );
  const [surfaceFrequency, setSurfaceFrequency] = useQueryState(
    'surfaceFrequency',
    1
  );
  const [surfaceSpeed, setSurfaceSpeed] = useQueryState('surfaceSpeed', 1);
  const [numberOfWaves, setNumberOfWaves] = useQueryState('numWaves', 4);
  const [surfacePoleAmount, setSurfacePoleAmount] = useQueryState(
    'surfPoleAmount',
    1
  );
  useControl('Distort', {
    type: 'number',
    state: [surfaceDistort, setSurfaceDistort],
    min: 0.0,
    max: 10.0,
    group: 'Blob Surface Noise',
  });
  useControl('Frequency', {
    type: 'number',
    state: [surfaceFrequency, setSurfaceFrequency],
    min: 0.01,
    max: 5,
    group: 'Blob Surface Noise',
  });
  useControl('Number of waves', {
    type: 'number',
    state: [numberOfWaves, setNumberOfWaves],
    min: 0,
    max: 20,
    group: 'Blob Surface Noise',
  });
  useControl('Speed', {
    type: 'number',
    state: [surfaceSpeed, setSurfaceSpeed],
    min: 0,
    max: 6,
    step: 1,
    group: 'Blob Surface Noise',
  });
  useControl('Pole amount', {
    type: 'number',
    state: [surfacePoleAmount, setSurfacePoleAmount],
    min: 0,
    max: 1,
    group: 'Blob Surface Noise',
  });

  const [blobSegments, setBlobSegments] = useQueryState('segments', 256);
  const [blobScale, setBlobScale] = useQueryState('scale', 1);
  const [fixNormals, setFixNormals] = useQueryState('uv', true);
  const [receiveShadow /*, setReceiveShadow*/] = useQueryState('rshad', false);
  const [rotX, setRotX] = useQueryState('rx', 0);
  const [rotY, setRotY] = useQueryState('ry', 0);
  const [rotZ, setRotZ] = useQueryState('rz', 0);
  useControl('Size', {
    type: 'number',
    state: [blobScale, setBlobScale],
    min: 0.5,
    max: 1.5,
    group: 'Blob Geometry',
  });
  useControl('Segments', {
    type: 'number',
    state: [blobSegments, setBlobSegments],
    min: 1,
    max: 512,
    group: 'Blob Geometry',
  });
  useControl('Fix Normals', {
    type: 'boolean',
    state: [fixNormals, setFixNormals],
    group: 'Blob Geometry',
  });
  useControl('Rotate X', {
    type: 'number',
    state: [rotX, setRotX],
    scrub: true,
    distance: Math.PI / 2,
    group: 'Blob Geometry',
  });
  useControl('Rotate Y', {
    type: 'number',
    state: [rotY, setRotY],
    scrub: true,
    distance: Math.PI / 2,
    group: 'Blob Geometry',
  });
  useControl('Rotate Z', {
    type: 'number',
    state: [rotZ, setRotZ],
    scrub: true,
    distance: Math.PI / 2,
    group: 'Blob Geometry',
  });

  // useControl('Self-shadow', { type: 'boolean', state: [receiveShadow, setReceiveShadow], group: 'Renderer' });

  /////////////////////////////////////////////////////////////////////////////
  // UTILS
  /////////////////////////////////////////////////////////////////////////////

  const blobMatProp = (prop) => {
    return presenceMaterialProps[prop][0];
  };

  // MATERIAL SPRING
  const materialSpring = useSpring({
    distort,
    frequency,
    speed,
    surfaceDistort,
    surfaceFrequency,
    surfaceSpeed,
    numberOfWaves,
    surfacePoleAmount,
    gooPoleAmount,
    fixNormals,
    color: blobMatProp('color'),
    envMapIntensity:
      isAboutOpen || !showAllMaterial ? 0 : blobMatProp('envMapIntensity'),
    roughness: blobMatProp('roughness'),
    metalness: blobMatProp('metalness'),
    clearcoat: blobMatProp('clearcoat'),
    clearcoatRoughness: blobMatProp('clearcoatRoughness'),
    transmission:
      isAboutOpen || !showAllMaterial ? 0 : blobMatProp('transmission'),
    // config: { tension: 20, friction: 10, precision: 0.0001 } // high precision to avoid seeing glitch on Freshwater
    config: { tension: 50, friction: 20, precision: 0.00001 },
  });

  // MESH SPRING
  const meshSpring = useSpring({
    scale: [blobScale * 0.14, blobScale * 0.14, blobScale * 0.14],
    rotation: [rotX, rotY, rotZ],
    config: { tension: 50, friction: 14 },
    position:
      isWeb3 && !mintAnimCardEnded
        ? [0, 0, 0] // keep at vcenter during export
        : [0, isRemix && isPortrait ? 0.03 : 0, 0],
  });

  /////////////////////////////////////////////////////////////////////////////
  // ANIMATION FRAME
  /////////////////////////////////////////////////////////////////////////////

  useFrame(() => {
    // move to grabTarget (better perf to raycast a small mesh)
    if (grabTarget.current) {
      grabTarget.current.getWorldQuaternion(globalQuaternion);
      grabTarget.current.getWorldPosition(globalPos);
      blob.current.position.copy(globalPos);
      blob.current.quaternion.copy(globalQuaternion);
    }
  });

  const sizeRatio = Math.min(1, (size.width / size.height) * 1.2);
  const gallerySize = 1.0 * sizeRatio;
  const remixSize = 1.0 * sizeRatio;
  const exportSize = 1.1 * sizeRatio;
  const successfulMintSize = successfulMintSceneScale * sizeRatio;

  let sceneScale = [gallerySize, gallerySize, gallerySize];
  if (isRemix) sceneScale = [remixSize, remixSize, remixSize];
  else if (isExport) sceneScale = [exportSize, exportSize, exportSize];

  const gallerySpring = useSpring({
    scale:
      isWeb3 && !mintAnimCardEnded
        ? [successfulMintSize, successfulMintSize, successfulMintSize]
        : !loaded
        ? [0, 0, 0]
        : isAboutOpen
        ? [1.8, 1.8, 1.8]
        : sceneScale,
    config: { tension: 20, friction: 10, precision: 0.001 },
  });

  useEffect(() => {
    // TODO cehck isLoaded if <Environment> in App takes time to load
    setLoaded(true);
    document.documentElement.classList.add('loaded');
    document.querySelector('.loaderblob').style.animation =
      'blobhide .5s both 1';
    document.querySelector('.loaderprogress').style.display = 'none';
  }, []);

  // Reduce triangles on Oculus Quest browser
  // FIXME don't rely on user agent... how?
  let segmentsY = blobSegments;
  let segmentsX = blobSegments * 1.33; //make sphere more uniform
  if (navigator.userAgent.includes('OculusBrowser')) {
    segmentsY = 256;
    segmentsX = 256;
  }

  return (
    <>
      <DebugMaterialControls
        material={material}
        materialProps={presenceMaterialProps}
        gradients={gradients}
        selectedGradient={selectedGradient}
        setSelectedGradient={setSelectedGradient}
      />

      {/* Ball hover target - main ref */}
      {/* <RayGrab> */}
      <group ref={mergeRefs([ref, grabTarget])} position={position}>
        <Sphere
          args={[1, 4, 4]}
          scale={[blobScale * 0.2, blobScale * 0.2, blobScale * 0.2]}
          material-wireframe
          position={[0, -0.0, 0]}
          visible={false}
        />
      </group>
      {/* </RayGrab> */}

      {/* Dynamic ball position */}
      <a.group ref={blob} {...props} {...gallerySpring} frustumCulled={false}>
        <a.mesh
          castShadow
          receiveShadow={receiveShadow}
          {...meshSpring}
          frustumCulled={false} // always visible
        >
          <sphereGeometry args={[1, segmentsX, segmentsY]} ref={geom} />
          <AnimatedMagicalMaterial
            ref={material}
            map={blobMatProp('useGradient') ? selectedGradient : null}
            // envMap={envMap}
            transparent={true}
            flatShading={blobMatProp('flatShading')}
            wireframe={blobMatProp('wireframe')}
            {...materialSpring}
          />

          {/* {enableShadow && <AniamtedMagicalDepthMaterial {...materialSpring} />} */}
        </a.mesh>
      </a.group>
    </>
  );
}

export default forwardRef(Blob);
