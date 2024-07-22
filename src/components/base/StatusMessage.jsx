'use client'
import React from 'react'
import { motion } from 'framer-motion'

function StatusMessage({ error = false, message = 'Error Message' }) {
  return (
    <motion.div
      whileInView={{
        opacity: [0, 1],
        // scale: [0, 1],
        transition: {
          duration: 0.5,
          ease: 'easeInOut',
        },
      }}
      className={`${
        error
          ? 'bg-rose-500/10 text-rose-600'
          : 'bg-green-500/10 text-green-600'
      } my-2 flex min-h-[60px] w-full max-w-md items-center justify-center rounded-lg p-4 px-5 capitalize xl:max-w-md`}
    >
      <p className={`text-xs font-semibold md:text-sm`}>{message}!</p>
    </motion.div>
  )
}

export default StatusMessage
