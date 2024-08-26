'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import useWorkspaces from './useWorkspaces'

const useNavigation = () => {
  const pathname = usePathname()
  const { workspaceID, activeWorkspace } = useWorkspaces()

  const dashboardRoute = `/dashboard/${workspaceID}`
  const settingsPathname = `${dashboardRoute}/settings`
  const isAccountLevelSettingsRoute = pathname.startsWith('/manage-account')

  const isUserInWorkspace =
    pathname.split('/')[1] == 'dashboard' && pathname.split('/').length >= 3

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
  const isUsersRoute = pathname == '/manage-account/users'  

  return {
    pathname,
    pathArr,
    isProfile,
    isSettingsPage,
    currentPath,
    dashboardRoute,
    isUsersRoute,
    settingsPathname,
    isAccountLevelSettingsRoute,
    isUserInWorkspace,
  }
}

export default useNavigation
