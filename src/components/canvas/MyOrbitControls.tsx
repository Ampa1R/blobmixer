import { useState, useEffect, useRef, useCallback } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useControl } from 'react-three-gui'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'

import { useUIStore, useBlobStore } from '../../store'

const ShowResetControl = ({ resetControls }) => {
  useControl('Reset Camera', { type: 'button', onClick: resetControls })
  return null
}

const MyOrbitControls = ({ target, cameraPosition }) => {
  const { camera, size } = useThree()
  const controls = useRef()
  const mouse = useRef({ x: 0, y: 0 }).current
  const isGallery = useUIStore((s) => s.isGallery)
  const isExport = useUIStore((state) => state.isExport)
  const isEmbedMode = !!useBlobStore.getState().embed
  const [showReset, setShowReset] = useState(false)
  const firstChange = useRef(true)

  const isEnabled = !isGallery && !isEmbedMode && !isExport

  const resetControls = () => {
    const pos = controls.current.object.position

    pos.x = cameraPosition[0]
    pos.y = cameraPosition[1]
    pos.z = cameraPosition[2]

    firstChange.current = true
    setShowReset(false)
  }

  const onChange = useCallback(
    (e) => {
      if (showReset || firstChange.current) {
        firstChange.current = false
        return
      }
      controls.current?.removeEventListener('change', onChange)
      setShowReset(true)
    },
    [controls, showReset]
  )

  const onMouseMove = useCallback(
    (e) => {
      mouse.x = ((e.clientX - size.width / 2) / size.width) * 2
      mouse.y = ((e.clientY - size.height / 2) / size.height) * 2
    },
    [mouse, size]
  )
  const onMouseOut = useCallback(
    (e) => {
      mouse.x = 0
      mouse.y = 0
    },
    [mouse]
  )

  useEffect(() => {
    const cntrl = controls.current

    if (!showReset) {
      controls.current?.addEventListener('change', onChange)
    }

    return () => {
      cntrl?.removeEventListener('change', onChange)
    }
  }, [showReset, onChange, camera, target])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseout', onMouseOut)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [onMouseMove, onMouseOut])

  useFrame(() => {
    if (!controls.current) return

    const currentPosition = controls.current.object.position
    const currentTarget = controls.current.target

    if (isGallery) {
      currentPosition.x = MathUtils.lerp(
        currentPosition.x,
        cameraPosition[0],
        0.1
      )
      currentPosition.y = MathUtils.lerp(
        currentPosition.y,
        cameraPosition[1],
        0.1
      )
      currentPosition.z = MathUtils.lerp(
        currentPosition.z,
        cameraPosition[2],
        0.1
      )
    }

    currentTarget.set(
      MathUtils.lerp(currentTarget.x, target[0], 0.1),
      MathUtils.lerp(currentTarget.y, target[1], 0.1),
      MathUtils.lerp(currentTarget.z, target[2], 0.1)
    )

    controls.current.update()
  })

  useEffect(() => {
    resetControls()
  }, [isExport])

  return (
    <>
      <OrbitControls
        ref={controls}
        enabled={isEnabled}
        enablePan={false}
        minDistance={0.5}
        maxDistance={2}
      />

      {showReset && <ShowResetControl resetControls={resetControls} />}
    </>
  )
}

export default MyOrbitControls
