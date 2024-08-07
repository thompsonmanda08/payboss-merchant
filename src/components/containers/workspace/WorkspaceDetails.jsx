import {
  changeWorkspaceVisibility,
  deleteWorkspace,
  updateWorkspace,
} from '@/app/_actions/config-actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/InputField'
import useWorkspaces from '@/hooks/useWorkspace'
import { SETUP_QUERY_KEY, WORKSPACES_QUERY_KEY } from '@/lib/constants'
import { cn, notify } from '@/lib/utils'
import { Switch } from '@nextui-org/react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const INITIAL_WORKSPACE = {
  workspace: '',
  description: '',
}

function WorkspaceDetails({ WorkSpaceID }) {
  const { workspaces, allWorkspaces } = useWorkspaces()
  const workspace = allWorkspaces.find(
    (workspace) => workspace.ID === WorkSpaceID,
  )

  const { back } = useRouter()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false) // DEACTIVATION STATE
  const [isSandbox, setIsSandbox] = useState(
    workspace?.workspace.toLowerCase() == 'sandbox',
  )

  // TO EDIT THE WORKSPACE FIELDS
  const [newWorkspace, setNewWorkspace] = useState(INITIAL_WORKSPACE)
  const [isVisible, setIsVisible] = useState(workspace?.isVisible)
  function editWorkspaceField(fields) {
    setNewWorkspace((prev) => {
      return { ...prev, ...fields }
    })
  }

  async function handleUpdateWorkspace(e) {
    e.preventDefault()
    setLoading(true)

    // VALIDATE INPUTS
    if (
      newWorkspace.workspace.length <= 3 ||
      newWorkspace.description.length <= 3
    ) {
      notify('error', 'Provide valid name and description!')
      setLoading(false)
      return
    }

    const response = await updateWorkspace({ ...newWorkspace, ID: WorkSpaceID })

    if (response.success) {
      queryClient.invalidateQueries({ queryKey: [SETUP_QUERY_KEY] })
      setLoading(false)
      notify('success', 'Workspaces created successfully!')
      return
    }

    notify('error', 'Failed to Update Workspace!')
    setLoading(false)
  }

  async function handleDeleteWorkspace() {
    setDeleteLoading(true)

    const response = await deleteWorkspace(WorkSpaceID)

    if (response.success) {
      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [SETUP_QUERY_KEY],
      })
      setDeleteLoading(false)
      notify('success', 'Workspaces Deactivated successfully!')
      back()
      return
    }

    notify('error', 'Failed to Deactivate Workspace!')
    setDeleteLoading(false)
  }

  async function handleWorkspaceVisibility() {
    setIsVisible(!isVisible)
    const response = await changeWorkspaceVisibility(WorkSpaceID, !isVisible)

    if (response.success) {
      queryClient.invalidateQueries([SETUP_QUERY_KEY])
      notify('success', 'Visibility updated successfully')
      return
    }

    setIsVisible(!isVisible)
    notify('error', 'Failed to update visibility')
  }

  // CHECK IF WORKSPACE IS VISIBLE
  useEffect(() => {
    if (workspace != undefined && workspace?.isVisible) {
      setIsVisible(workspace?.isVisible)
    }

    if (
      workspace != undefined &&
      workspace?.workspace.toLowerCase() == 'sandbox'
    ) {
      setIsSandbox(true)
    }
  }, [])

  return (
    <>
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="flex flex-col gap-6 ">
          {/* <div className="flex w-full items-center gap-x-8">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            />
            <div>
              <Button type="button">Change Workspace Image</Button>
              <p className="mt-2 text-xs leading-5 text-gray-400">
                JPG, GIF or PNG. 2MB max.
              </p>
            </div>
          </div> */}

          <form
            onSubmit={handleUpdateWorkspace}
            role={'edit-workspace-details'}
            className="flex w-full flex-col items-center gap-4 sm:items-start md:flex-row md:items-end"
          >
            <Input
              label="Workspace Name"
              defaultValue={workspace?.workspace}
              isDisabled={loading || isSandbox}
              onChange={(e) => {
                editWorkspaceField({ workspace: e.target.value })
              }}
            />

            <Input
              label="Description"
              isDisabled={loading || isSandbox}
              defaultValue={workspace?.description}
              containerClasses={cn('', { 'w-full max-w-[700px]': isSandbox })}
              onChange={(e) => {
                editWorkspaceField({ description: e.target.value })
              }}
            />
            {!isSandbox && (
              <Button
                type="submit"
                isDisabled={loading || isSandbox}
                isLoading={loading}
                loadingText={'Saving... '}
                className={'w-full max-w-full sm:max-w-sm '}
              >
                Save Changes
              </Button>
            )}
          </form>
        </div>
      </div>
      <hr className="my-10 h-px bg-slate-900/5" />
      <div className="flex items-center gap-x-4 sm:mt-0 sm:flex-auto">
        <Switch
          isSelected={isVisible}
          onValueChange={handleWorkspaceVisibility}
        />
        <div className="flex flex-col ">
          <p className="font-medium text-gray-900">Workspace Visibility</p>
          <span className="text-xs text-slate-600 xl:text-sm">
            Activate a to interact with the PayBoss platform using this
            workspace.
          </span>
        </div>
      </div>
      <hr className="my-10 h-px bg-slate-900/5" />
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex max-w-4xl flex-col gap-4">
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Deactivate Workspace
          </h2>
          <p className="text-sm leading-6 text-gray-400">
            If you wish to deactivate or delete your workspace, you can do so
            here. This action can only be reversed by contacting our support
            team. Please note that all information related to this workspace
            will be retained for audit purposes in accordance with regulatory
            requirements.
          </p>
        </div>

        <Button
          color="danger"
          type="submit"
          isDisabled={deleteLoading}
          isLoading={deleteLoading}
          onClick={handleDeleteWorkspace}
          className="self-end rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
        >
          Yes, deactivate my workspace
        </Button>
      </div>
    </>
  )
}

export default WorkspaceDetails
