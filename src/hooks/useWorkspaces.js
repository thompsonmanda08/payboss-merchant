'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useGetWorkspaces, useSetupConfig } from './useQueryHooks'

const useWorkspaces = (query) => {
  const pathname = usePathname()
  const [isSandboxVisible, setIsSandboxVisible] = useState(false)
  const {
    data: workspacesData,
    isFetching: fetchingWorkspaces,
    isLoading: loadingWorkspaces,
  } = useGetWorkspaces()
  const {
    data: setup,
    isFetching: fetchingSetup,
    isLoading: loadingSetup,
  } = useSetupConfig()

  const workspaces = setup?.data?.workspaces || []
  const allWorkspaces = workspacesData?.data?.workspaces || []

  const isFetching = fetchingSetup || fetchingWorkspaces
  const isLoading = loadingSetup || loadingWorkspaces

  const isUserInWorkspace =
    pathname.split('/')[1] == 'dashboard' && pathname.split('/').length >= 3

  const workspaceID = isUserInWorkspace
    ? pathname.split('/')[2]
    : query?.workspaceID || ''

  const activeWorkspace = workspaces?.find(
    (workspace) => workspace?.ID == workspaceID,
  )

  const userInSandbox = activeWorkspace?.workspace?.toLowerCase() === 'sandbox'

  const sandbox = workspaces?.find(
    (item) => item?.workspace?.toLowerCase() === 'sandbox',
  )

  const workspaceWalletBalance =
    activeWorkspace?.balance ||
    workspaces?.find((workspace) => workspace?.ID == query?.workspaceID)
      ?.balance

  // CHECK IF SANDBOX WORKSPACE IS UNDEFINED
  useEffect(() => {
    if (sandbox != undefined) {
      setIsSandboxVisible(true)
    }
  }, [])

  return {
    isFetching,
    isLoading,
    activeWorkspace,
    allWorkspaces,
    workspaces,
    workspaceID: activeWorkspace?.ID,
    workspaceWalletBalance,
    isUserInWorkspace,
    sandbox,
    isSandboxVisible,
    setIsSandboxVisible,
    userInSandbox,
  }
}

export default useWorkspaces
