'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useGetWorkspaces, useSetupConfig } from './useQueryHooks'
import useWorkspaces from './useWorkspace'

const useDashboard = () => {
  const pathname = usePathname()

  const { userInSandbox, activeWorkspace, isFetching, isLoading } =
    useWorkspaces()

  return {}
}

export default useDashboard
