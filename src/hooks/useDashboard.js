'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import {
  useGetWorkspaces,
  useSetupConfig,
  useWorkspaceInit,
} from './useQueryHooks'
import useWorkspaces from './useWorkspaces'

const useDashboard = () => {
  const pathname = usePathname()

  const { userInSandbox, activeWorkspace, workspaceID, isFetching, isLoading } =
    useWorkspaces()

  const { data: workspaceData } = useWorkspaceInit(workspaceID)

  console.log(workspaceData)
  const workspaceUserRole = workspaceData?.data

  return { workspaceData, workspaceUserRole }
}

export default useDashboard
