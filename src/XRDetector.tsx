import { useEffect } from 'react';
import { useXR } from '@react-three/xr';
import { useThree } from '@react-three/fiber';

import { useUIStore } from './store';

export default function XRDetector({ onPresenting }) {
  const camera = useThree((state) => state.camera);
  const player = useXR((state) => state.player);
  const isVR = useUIStore((state) => state.isVR);

  useEffect(() => {
    onPresenting({ isPresenting: isVR, player, camera });
  }, [isVR, onPresenting, player, camera]);

  return null;
}
