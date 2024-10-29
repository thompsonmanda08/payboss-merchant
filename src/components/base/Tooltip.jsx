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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: -68 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-no-wrap absolute z-10 min-w-[250px] overflow-hidden rounded-lg bg-primary p-2 text-xs text-white shadow-lg"
            style={{ top: '-20', right: '100%', transform: 'translateX(-50%)' }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
