'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import useWorkspaces from './useWorkspace'

const useNavigation = () => {
  const pathname = usePathname()
  const { workspaceID, activeWorkspace } = useWorkspaces()

  const dashboardRoute = `/dashboard/${workspaceID}`
  const settingsPathname = `${dashboardRoute}/settings`

  const pathArr = pathname?.split('/')
  const currentPath =
    pathArr?.length >= 4
      ? pathArr[pathArr?.length - 1]?.replaceAll('-', ' ')
      : pathArr[3]?.replaceAll('-', ' ') || activeWorkspace?.workspace

  const isProfile =
    settingsPathname == pathname ||
    (pathArr?.length == 4 &&
      pathArr?.[3]?.replaceAll('-', ' ').toLowerCase() === 'settings')

  const isSettingsPage = pathname.split('/')[3]?.toLowerCase() == 'settings'

  return {
    pathArr,
    isProfile,
    isSettingsPage,
    currentPath,
    dashboardRoute,
    settingsPathname,
  }
}

export default useNavigation
