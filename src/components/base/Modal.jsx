'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { cn } from '@/lib/utils'
import CardHeader from './CardHeader'

const modalVariants = {
  hidden: { opacity: 0, y: '-50%', scale: 0.8 },
  visible: { opacity: 1, y: '0%', scale: 1 },
  exit: { opacity: 0, y: '-50%', scale: 0.8 },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

function Modal({
  show,
  onConfirm,
  onClose,
  confirmText,
  cancelText,
  children,
  width,
  height,
  title,
  infoText,
  loading,
  disableAction,
  removeCallToAction,
  isDismissible = true,
  className,
  classNames,
}) {
  const [isOpen, setIsOpen] = useState(show || false)
  const [noCallToAction, setNoCallToAction] = useState(
    removeCallToAction || false,
  )

  useEffect(() => {
    setIsOpen(show)
  }, [show])

  const handleClose = (e) => {
    e?.stopPropagation()
    setIsOpen(false)
    setTimeout(onClose, 250) // Match the duration of the exit animation
  }

  function dismissModal() {
    if (isDismissible) {
      handleClose()
    }
  }

  const { overlay, base, card, container } = classNames || ''

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          transition={{ duration: 0.25 }}
          onClick={dismissModal}
          className={cn(
            'absolute inset-0 z-50 flex h-screen w-full items-center justify-center bg-slate-800/50',
            overlay,
          )}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.25 }}
            style={{
              maxWidth: width ? `${width}px` : '380px',
              minHeight: height ? `${height}px` : '180px',
              // height: height ? `${height}px` : 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'z-50 flex w-full flex-col items-center justify-start gap-1 rounded-lg bg-[#ffffff] p-4',
              className,
              base,
              card,
            )}
          >
            <CardHeader
              title={title}
              infoText={infoText}
              handleClose={handleClose}
            />
            {/* MODAL CONTENT */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'mb-2 mt-5 flex h-full w-full flex-grow flex-col',
                container,
              )}
            >
              {children}
            </div>
            {!noCallToAction && (
              <div className="mt-auto flex w-full justify-end gap-3">
                <Button onClick={handleClose} color="danger" className="">
                  {cancelText || 'Cancel'}
                </Button>
                <Button
                  isLoading={loading}
                  onClick={onConfirm}
                  disabled={loading || disableAction}
                  className=" px-6"
                >
                  {confirmText || 'Done'}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
