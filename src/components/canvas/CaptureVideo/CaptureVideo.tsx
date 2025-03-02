import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

import { useMp4h264 } from './useMp4h264'
import {
  LOOP_DURATION,
  VIDEO_SIZE,
  EXPORT_DPR,
  EXPORT_KBPS,
  EXPORT_FPS,
  EXPORT_PRIORITY,
} from '../../../lib/config'

function CaptureVideo({ onProgress, onCaptured, hasPostProcessing }) {
  const { width, height } = useThree((s) => s.size)
  const dpr = useThree((s) => s.viewport.dpr)

  const { startRecording, isRecording } = useMp4h264({
    duration: LOOP_DURATION,
    fps: EXPORT_FPS,
    debug: false,
    priority: EXPORT_PRIORITY,
    checkSIMD: false, // not working?
    onProgress,
    onRecordingEnd: onCaptured,
    forceRender: !hasPostProcessing,
    encoderOptions: {
      kbps: EXPORT_KBPS,
    },
  })

  useEffect(() => {
    if (
      !isRecording &&
      dpr === EXPORT_DPR &&
      width === VIDEO_SIZE &&
      height === VIDEO_SIZE
    ) {
      startRecording()
    }
  }, [dpr, width, height, isRecording, startRecording])

  return null
}

export default CaptureVideo
