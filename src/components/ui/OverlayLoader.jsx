'use client'
import React, { useEffect, useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Spinner from './Spinner'

const modalVariants = {
  hidden: { opacity: 0, y: '-20%', scale: 0.5 },
  visible: { opacity: 1, y: '0%', scale: 1 },
  exit: { opacity: 0, y: '-20%', scale: 0.5 },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

function OverlayLoader({ show, className, classNames }) {
  const [isOpen, setIsOpen] = useState(show || false)

  useEffect(() => {
    setIsOpen(show)

    return () => {
      setIsOpen(false)
    }
  }, [show])

  const { wrapper, conatiner, spinner } = classNames || ''

  return (
    isOpen && (
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          transition={{ duration: 0.25 }}
          className={cn(
            'absolute inset-0 z-[999] flex h-screen w-full items-center justify-center bg-slate-900/60',
            wrapper,
          )}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'grid h-full w-full place-content-center place-items-center',
              className,
              conatiner,
            )}
          >
            <Spinner size={120} color="#ffffff" className={spinner} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  )
}

export default OverlayLoader
