import { useState, useEffect } from 'react'

const useFloatingHeader = (point) => {
  const [isFloating, setIsFloating] = useState(false)

  useEffect(() => {
    const scrollYPos = window.addEventListener('scroll', () => {
      window.scrollY > point ? setIsFloating(true) : setIsFloating(false)
    })

    return () => window.removeEventListener('scroll', scrollYPos)
  })

  return isFloating
}

export default useFloatingHeader
