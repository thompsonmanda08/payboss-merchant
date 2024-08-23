'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

function Card({ className, classObject, href, children }) {
  const cardClasses = cn(
    'flex w-full flex-col rounded-2xl bg-white p-5 shadow-xl shadow-neutral-400/10 border border-border transition-all duration-300',
    className,
    classObject,
  )
  return href ? (
    <Link href={href}>
      <motion.div
        animate={{
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 0.3,
          },
        }}
        className={cardClasses}
      >
        {children}
      </motion.div>
    </Link>
  ) : (
    <motion.div
      animate={{
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 20,
          duration: 0.3,
        },
      }}
      className={cardClasses}
    >
      {children}
    </motion.div>
  )
}

export default Card
