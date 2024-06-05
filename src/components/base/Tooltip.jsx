'use client'
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Tooltip = ({ children, content }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef(null)
  const containerRef = useRef(null)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      ref={containerRef}
    >
      {children}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="whitespace-no-wrap absolute z-10 min-w-[250px] overflow-hidden rounded bg-gray-800 p-2 text-xs text-white shadow-lg"
            style={{ top: '15', right: '0', transform: 'translateX(-50%)' }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
