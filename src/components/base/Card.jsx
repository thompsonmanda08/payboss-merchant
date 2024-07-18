import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

function Card({ className, classObject, href, children }) {
  const cardClasses = cn(
    'flex w-full flex-col rounded-lg bg-white p-5 shadow-xl shadow-slate-300/10',
    className,
    classObject,
  )
  return href ? (
    <Link href={href} className={cardClasses}>
      {children}
    </Link>
  ) : (
    <div className={cardClasses}>{children}</div>
  )
}

export default Card
