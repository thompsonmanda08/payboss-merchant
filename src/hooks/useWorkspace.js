'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useSetupConfig } from './useQueryHooks'

const useWorkspaces = () => {
  const pathname = usePathname()
  const [activeWorkspace, setActiveWorkspace] = useState({})
  const { data: setup, isFetching, isLoading } = useSetupConfig()
  const workspaces = setup?.data?.workspaces || []
  const urlRouteParams = pathname.match(/^\/dashboard\/([^\/]+)\/?$/)

  const isUserInWorkspace =
    pathname.split('/')[1] == 'dashboard' && pathname.split('/').length >= 3

  const workspaceID = isUserInWorkspace ? pathname.split('/')[2] : ''

  useEffect(() => {
    if (isUserInWorkspace) {
      // console.log(urlRouteParams)
      // const workspaceID = urlRouteParams[1] || ''
      console.log(workspaceID)
      const workspace = workspaces?.find(
        (workspace) => workspace?.ID === workspaceID,
      )

      setActiveWorkspace(workspace)
    }
  }, [pathname])

  return { activeWorkspace, workspaces, isFetching, isLoading }
}

export default useWorkspaces
