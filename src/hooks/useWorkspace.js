'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useSetupConfig } from './useQueryHooks'

const useWorkspaces = () => {
  const pathname = usePathname()
  const [activeWorkspace, setActiveWorkspace] = useState({})
  const { data: setup, isFetching, isLoading } = useSetupConfig()
  const workspaces = setup?.data?.workspaces || []

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const urlRouteParams = pathname.match(/^\/dashboard\/([^\/]+)\/?$/)

  useEffect(() => {
    if (urlRouteParams && isDashboardRoute) {
      const workspaceID = urlRouteParams[1] || ''
      const workspace = workspaces?.find(
        (workspace) => workspace?.ID === workspaceID,
      )
      setActiveWorkspace(workspace)
    }
  }, [pathname])

  return { activeWorkspace, workspaces, isFetching, isLoading }
}

export default useWorkspaces
