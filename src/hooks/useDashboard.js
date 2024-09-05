'use client'

import { useDashboardAnalytics, useWorkspaceInit } from './useQueryHooks'
import useWorkspaces from './useWorkspaces'

const useDashboard = () => {
  const {
    userInSandbox,
    activeWorkspace,
    workspaceID,
    isLoading: workspaceLoading,
  } = useWorkspaces()

  const { data: workspaceResponse, isLoading: initLoading } =
    useWorkspaceInit(workspaceID)
  const workspaceUserRole = workspaceResponse?.data

  const { data: analyticsResponse, isLoading: analyticsLoading } =
    useDashboardAnalytics(workspaceID)

  const dashboardAnalytics = analyticsResponse?.data

  const isLoading = workspaceLoading || analyticsLoading || initLoading

  return {
    workspaceUserRole,
    isLoading,
    dashboardAnalytics,
    userInSandbox,
    activeWorkspace,
  }
}

export default useDashboard
