import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { useUIStore } from '../../../store'

const PreviousRoute = () => {
  const location = useLocation()

  const previousRoute = useRef('')

  useEffect(() => {
    useUIStore.setState(() => ({ previousRoute: previousRoute.current }))

    previousRoute.current = location.pathname
  }, [location])

  return null
}

export default PreviousRoute