'use client'
import LoadingPage from '@/app/loading'
import { WorkspaceItem } from '@/components/base'
import { Button } from '@/components/ui/Button'
import { useSetupConfig } from '@/hooks/useQueryHooks'
import { PlusIcon } from '@heroicons/react/24/outline'
import React from 'react'

function Workspaces() {
  const { data: setupResponse, isLoading } = useSetupConfig()

  if (isLoading) return <LoadingPage />

  return (
    <div className="flex w-full flex-col items-center justify-center ">
      <div className="flex w-full flex-col">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4 rounded-lg">
          <WorkspaceItem />
          <WorkspaceItem />
          <WorkspaceItem />
          <Button className="h-24 w-full flex-col border border-primary-100 bg-transparent font-medium text-primary hover:border-primary-100 hover:bg-primary-50">
            <PlusIcon className=" h-6 w-6" />
            Create Workspace
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Workspaces
