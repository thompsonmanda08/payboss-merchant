'use client'
import React, { useState, useEffect } from 'react'
import {
  useAccountRoles,
  useAllUsers,
  useWorkspaceRoles,
} from './useQueryHooks'
import useAccountProfile from './useProfileDetails'

const useAllUsersAndRoles = () => {
  const { data: allUserData } = useAllUsers()
  const { data: merchantRoles } = useAccountRoles()
  const { data: workspaceRoleData } = useWorkspaceRoles()
  const { isAccountAdmin, isOwner } = useAccountProfile()

  const allUsers = allUserData?.data?.users
  const accountRoles = merchantRoles?.data?.roles || []
  const workspaceRoles = workspaceRoleData?.data?.roles || []

  // PERMISSIONS
  const canCreateUsers = isAccountAdmin || isOwner

  return {
    allUsers,
    accountRoles,
    workspaceRoles,
    canCreateUsers,
  }
}

export default useAllUsersAndRoles
