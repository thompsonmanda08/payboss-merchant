import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
  exit: { x: '100%' },
}


const Drawer = ({ isOpen, onClose, title,children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex max-w-full"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
          >
            <div className="w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      {title}
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        onClick={onClose}
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex-1 px-4 sm:px-6">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Drawer
