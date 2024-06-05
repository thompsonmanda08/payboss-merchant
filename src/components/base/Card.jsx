import { cn } from '@/lib/utils'
import React from 'react'

function Card({ className, classObject, children }) {
  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-lg bg-white p-5 shadow-2xl shadow-slate-300/30',
        className,
        classObject,
      )}
    >
      {children}
    </div>
  )
}

export default Card
