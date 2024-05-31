import React from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'

import { Button } from '../ui/Button'
import { Spinner } from '.'

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
  const [isOpen, setIsOpen] = React.useState(show || false)
  const [noCallToAction, setNoCallToAction] = React.useState(
    removeCallToAction || false,
  )

  return isOpen ? (
    <div
      onClick={(e) => {
        e.stopPropagation()
        setIsOpen(false)
        onClose()
      }}
      className="absolute inset-0 z-[999] flex h-screen w-full items-center justify-center bg-slate-800/50"
    >
      <div
        style={{
          maxWidth: width ? width + 'px' : '380px',
          height: height ? height + 'px' : 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
        className={`z-[999] flex w-full flex-col items-center justify-between gap-1 rounded-lg bg-white p-4`}
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
            onClick={() => {
              setIsOpen(false)
              onClose()
            }}
            className="absolute  -right-1 -top-2 cursor-pointer rounded-full p-2 text-primary/30 transition-all duration-300 ease-in-out hover:bg-primary/10 hover:text-primary"
          >
            <Cross1Icon className="aspect-square w-6" />
          </div>
        </div>

        {/* MODAL  */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="mb-2 flex h-[65%] w-full flex-col"
        >
          {children}
        </div>

        {!noCallToAction && (
          <div className="flex w-full justify-end gap-3">
            <Button
              onClick={() => {
                setIsOpen(false)
                onClose()
              }}
              className={
                'h-12 bg-rose-500/10 text-rose-400 hover:bg-rose-500/30'
              }
            >
              {cancelText || 'Cancel'}
            </Button>
            <Button
              onClick={() => {
                onConfirm()
              }}
              disabled={loading || disableAction}
              className={'h-12 px-6'}
            >
              {loading ? (
                <Spinner color="#fff" size={18} />
              ) : (
                confirmText || 'Done'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  )
}

export default Modal
