'use client'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export default function BreadCrumb({ baseUrl = '/', isProfile }) {
  const pathname = usePathname()
  const [path, setPath] = useState([baseUrl])

  useEffect(() => {
    setPath([...pathname.split('/').filter((path) => path !== '')])
  }, [pathname])

  function handleBreadCrumbClick(idx) {
    window.location.href = `${baseUrl}/${path
      .slice(0, idx + 1)
      .join('/')}`.replace('//', '/')
  }

  return (
    <div className="flex w-full justify-between text-xs ">
      <div className="flex pr-1 pt-1">
        {path &&
          path.map((segment, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <Link
                onClick={() => handleBreadCrumbClick(idx)}
                href={`${baseUrl}/${path.slice(0, idx + 1).join('/')}`.replace(
                  '//',
                  '/',
                )}
                className={cn(
                  ` cursor-pointer px-2 font-medium capitalize text-slate-400`,
                  {
                    'text-slate-700': idx === path.length - 1,
                    'text-white': isProfile,
                  },
                )}
              >
                {segment.replace(/-|%20/g, ' ')}
              </Link>
              {idx < path.length - 1 && (
                <ChevronRightIcon
                  className={cn('h-3 w-3 text-slate-500 hover:text-primary', {
                    'text-white': isProfile,
                  })}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
