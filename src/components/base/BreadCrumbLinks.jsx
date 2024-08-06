'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import useWorkspaces from '@/hooks/useWorkspace'

export default function BreadCrumbLinks({ baseUrl = '/', isProfile }) {
  const router = useRouter()
  const pathname = usePathname()
  const { workspaces } = useWorkspaces()

  const [path, setPath] = useState([baseUrl])
  const [href, setHref] = useState([])
  let newPathArr = pathname.split('/')
  const workspaceID = pathname.startsWith('/dashboard') ? newPathArr[2] : ''

  useEffect(() => {
    /********************* WORKSPACE NAME ********************** */
    if (newPathArr.length > 2 && pathname?.startsWith('/dashboard')) {
      let workspace = workspaces?.find(
        (item) => item?.ID == workspaceID,
      )?.workspace
      newPathArr[2] = workspace

      // SET A NEW HREF ARRAY
      setHref((prev) => [...prev, 'dashboard', workspaceID])
    }

    /***************************************************************** */
    setPath([...newPathArr.filter((path) => path !== '')])
  }, [pathname, workspaceID])

  return (
    <div className="flex w-full justify-between text-xs ">
      <div className="flex pr-1 pt-1">
        {path &&
          path.map((segment, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <Link
                onClick={() => handleBreadCrumbClick(idx)}
                href={`${baseUrl}/${href.slice(0, idx + 1).join('/')}`.replace(
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
                {segment?.replace(/-|%20/g, ' ')}
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
