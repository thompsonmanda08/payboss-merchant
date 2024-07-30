'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import useConfigStore from '@/context/configStore'
import { useSetupConfig } from '@/hooks/useQueryHooks'

export default function BreadCrumbLinks({ baseUrl = '/', isProfile }) {
  const stateWorkspaces = useConfigStore((state) => state.workspaces)
  const { data: response, isLoading, isSuccess } = useSetupConfig()
  const { workspaces: myWorkspaces } = response?.data || []
  const workspaces = stateWorkspaces || myWorkspaces

  const pathname = usePathname()
  const router = useRouter()
  const [path, setPath] = useState([baseUrl])
  const [href, setHref] = useState([])
  let newPathArr = pathname.split('/')
  const workspaceID = pathname.startsWith('/dashboard') ? newPathArr[2] : ''

  useEffect(() => {
    console.log(workspaces)
    console.log(newPathArr)
    console.log(workspaceID)

    /********************* WORKSPACE NAME ********************** */
    if (newPathArr.length > 2 && pathname.startsWith('/dashboard')) {
      let workspace = workspaces.find(
        (item) => item?.ID == workspaceID,
      )?.workspace
      console.log(workspace)
      newPathArr[2] = workspace
      console.log(newPathArr)

      setHref((prev) => [...prev, 'dashboard', workspaceID])
    }

    /***************************************************************** */
    setPath([...newPathArr.filter((path) => path !== '')])
  }, [pathname, workspaceID])

  // function handleBreadCrumbClick(idx) {
  //   window.location.href = `${baseUrl}/${path
  //     .slice(0, idx + 1)
  //     .join('/')}`.replace('//', '/')
  // }

  // useEffect(() => {}, [pathname])
  console.log(href)
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
