'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useAllUsers, useGetWorkspaces, useSetupConfig } from './useQueryHooks'

const useWorkspaces = () => {
  const pathname = usePathname()
  const [userInSandbox, setUserInSandbox] = useState(false)
  const [activeWorkspace, setActiveWorkspace] = useState({})
  const [isSandboxVisible, setIsSandboxVisible] = useState(false)
  const { data: workspacesData } = useGetWorkspaces()
  const { data: setup, isFetching, isLoading } = useSetupConfig()
  const { data: allUSerData } = useAllUsers()
  // const { data: workspaceUserData, isFetching, isLoading } = useWorkspaceInit()

  const workspaces = setup?.data?.workspaces || []
  const allWorkspaces = workspacesData?.data?.workspaces || []

  // const workspaceUser = workspaceUserData?.data.user
  // const isWorkspaceAdmin =
  //   workspaceUserData?.data?.role.toLowerCase() == 'admin'
  // const isWorkspaceMember =
  //   workspaceUserData?.data?.role.toLowerCase() == 'member'
  // const isWorkspaceGuest =
  //   workspaceUserData?.data?.role.toLowerCase() == 'guest'

  // console.log(allUSerData)

  const isUserInWorkspace =
    pathname.split('/')[1] == 'dashboard' && pathname.split('/').length >= 3

  const workspaceID = isUserInWorkspace ? pathname.split('/')[2] : ''

  const sandbox = workspaces?.find(
    (item) => item?.workspace?.toLowerCase() === 'sandbox',
  )

  useEffect(() => {
    // CHECK IF THE USER IS IN A WORKSPACE
    if (isUserInWorkspace) {
      const workspace = workspaces?.find(
        (workspace) => workspace?.ID === workspaceID,
      )

      // CHECK IF THE USER IS IN A SANDBOX WORKSPACE
      if (workspace === sandbox) {
        setUserInSandbox(true)
      }

      // SET CURRENTLY ACTIVE WORKSPACE
      setActiveWorkspace(workspace)
    }
  }, [pathname, workspaces, sandbox])

  // CHECK IF SANDBOX WORKSPACE IS UNDEFINED
  useEffect(() => {
    if (sandbox != undefined) {
      setIsSandboxVisible(true)
    }
  }, [])

  return {
    activeWorkspace,
    allWorkspaces,
    workspaces,
    workspaceID: activeWorkspace?.ID,
    sandbox,
    isSandboxVisible,
    setIsSandboxVisible,
    userInSandbox,
    isFetching,
    isLoading,
  }
}

export default useWorkspaces
