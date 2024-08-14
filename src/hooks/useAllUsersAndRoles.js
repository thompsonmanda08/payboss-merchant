'use client'
import React, { useState, useEffect } from 'react'
import {
  useAccountRoles,
  useAllUsers,
  useWorkspaceRoles,
} from './useQueryHooks'

const useAllUsersAndRoles = () => {
  const { data: allUserData } = useAllUsers()
  const { data: merchantRoles } = useAccountRoles()
  const { data: workspaceRoleData } = useWorkspaceRoles()

  const allUsers = allUserData?.data?.users
  const accountRoles = merchantRoles?.data?.roles || []
  const workspaceRoles = workspaceRoleData?.data?.roles || []

  return {
    allUsers,
    accountRoles,
    workspaceRoles,
  }
}

export default useAllUsersAndRoles
