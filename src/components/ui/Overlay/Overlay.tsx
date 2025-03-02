import { useCallback, useEffect } from 'react'
import { useTransition } from '@react-spring/three'
import { a } from '@react-spring/web'
import classNames from 'classnames/bind'

import { useUIStore } from '../../../store'
import s from './Overlay.module.scss'
var cx = classNames.bind(s)

const Overlay = ({
  children,
  onClose,
  isOpen,
  variant,
  className,
  innerClassName,
}) => {
  const transition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 200 },
  })

  const clearColor = useUIStore((s) => s.clearColor)

  const handleKeyDown = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        // ESC
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute('content', isOpen ? '#000' : clearColor)
  }, [isOpen, clearColor])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, false)
    window.addEventListener('popstate', onClose)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, false)
      window.removeEventListener('popstate', onClose)
    }
  }, [handleKeyDown, onClose])

  const fragment = transition((style, item) => {
    return (
      item && (
        <a.div style={style}>
          <div
            className={cx(s.overlay, { web3: variant === 'web3' }, className)}
          >
            <svg
              className={s.btnClose}
              width="28"
              height="27"
              viewBox="0 0 28 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={onClose}
            >
              <line
                x1="26.8096"
                y1="0.353553"
                x2="1.35376"
                y2="25.8094"
                stroke="white"
              />
              <line
                x1="26.1025"
                y1="25.8094"
                x2="0.64666"
                y2="0.353518"
                stroke="white"
              />
            </svg>

            <div className={cx(s.grid, innerClassName)}>{children}</div>
          </div>
        </a.div>
      )
    )
  })
  return fragment
}

export default Overlay
