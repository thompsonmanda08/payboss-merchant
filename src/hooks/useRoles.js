import { useEffect, useState } from 'react'
import { useAccountRoles, useWorkspaceRoles } from './useQueryHooks'

export const useRoles = () => {
  const { data: merchantRoles } = useAccountRoles()
  const { data: workspaceRoleData } = useWorkspaceRoles()
  const accountRoles = merchantRoles?.data?.roles || []
  const workspaceRoles = workspaceRoleData?.data?.roles || []

  // useEffect(() => {
  //   //
  //   //

  //   return () => {
  //     //
  //     //
  //   }
  // }, [])

  //
  return { accountRoles, workspaceRoles }
}
