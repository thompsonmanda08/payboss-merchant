'use client'
import { Balance, Card, CardHeader } from '@/components/base'
import React from 'react'
import useAccountProfile from '@/hooks/useProfileDetails'
import { UserAvatarComponent } from '../users/UsersTable'
import { cn } from '@/lib/utils'
import Wallet from '../workspace/Wallet'
import useWorkspaces from '@/hooks/useWorkspaces'

const InitiatorsLog = ({ user }) => {
  const { activeWorkspace, workspaceID } = useWorkspaces()
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Wallet
        workspaceName={activeWorkspace?.workspace}
        workspaceID={workspaceID}
        hideHistory
      />
    </div>
  )
}

export default InitiatorsLog
