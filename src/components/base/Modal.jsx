'use client'
import React, { useEffect, useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Spinner } from '.';

const modalVariants = {
  hidden: { opacity: 0, y: '-50%', scale: 0.8 },
  visible: { opacity: 1, y: '0%', scale: 1 },
  exit: { opacity: 0, y: '-50%', scale: 0.8 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

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
}) {
  const [isOpen, setIsOpen] = useState(show || false);
  const [noCallToAction, setNoCallToAction] = useState(removeCallToAction || false);

  useEffect(() => {
    setIsOpen(show);
  }, [show]);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    setTimeout(onClose, 250); // Match the duration of the exit animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          className="absolute inset-0 z-[999] flex h-screen w-full items-center justify-center bg-slate-800/50"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.25 }}
            style={{
              maxWidth: width ? `${width}px` : '380px',
              height: height ? `${height}px` : 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            className="z-[999] flex w-full flex-col items-center justify-between gap-1 rounded-lg bg-white p-4"
          >
            {/* CLOSE MODAL ICON */}
            <div className="relative flex w-full items-center justify-between">
              {title && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold tracking-tight text-slate-800 xl:text-base">
                    {title}
                  </h3>
                  {infoText && (
                    <p className="mb-2 text-xs text-gray-500 sm:text-sm">
                      {infoText}
                    </p>
                  )}
                </div>
              )}
              <div
                onClick={handleClose}
                className="absolute -right-1 -top-2 cursor-pointer rounded-full p-2 text-primary/30 transition-all duration-300 ease-in-out hover:bg-primary/10 hover:text-primary"
              >
                <Cross1Icon className="aspect-square w-6" />
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mb-2 flex h-[65%] w-full flex-col"
            >
              {children}
            </div>

            {!noCallToAction && (
              <div className="flex w-full justify-end gap-3">
                <Button
                  onClick={handleClose}
                  className="h-12 bg-rose-500/10 text-rose-400 hover:bg-rose-500/30"
                >
                  {cancelText || 'Cancel'}
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={loading || disableAction}
                  className="h-12 px-6"
                >
                  {loading ? (
                    <Spinner color="#fff" size={18} />
                  ) : (
                    confirmText || 'Done'
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
