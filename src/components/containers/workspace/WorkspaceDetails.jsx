import {
  changeWorkspaceVisibility,
  deleteWorkspace,
  updateWorkspace,
} from '@/app/_actions/config-actions'
import PromptModal from '@/components/base/Prompt'
import Prompt from '@/components/base/Prompt'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/InputField'
import useWorkspaces from '@/hooks/useWorkspace'
import { SETUP_QUERY_KEY, WORKSPACES_QUERY_KEY } from '@/lib/constants'
import { cn, notify } from '@/lib/utils'
import { Switch, useDisclosure } from '@nextui-org/react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function WorkspaceDetails({ WorkSpaceID }) {
  const { back } = useRouter()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleteError, setDeleteError] = useState({ status: false, message: '' })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState('')
  const { workspaces, allWorkspaces } = useWorkspaces()
  const workspace = allWorkspaces.find(
    (workspace) => workspace.ID === WorkSpaceID,
  )

  const [isSandbox, setIsSandbox] = useState(
    workspace?.workspace.toLowerCase() == 'sandbox',
  )

  const [newWorkspace, setNewWorkspace] = useState({
    workspace: workspace?.workspace,
    description: workspace?.description,
  })

  const [isVisible, setIsVisible] = useState(workspace?.isVisible)

  const noChangesToSave =
    newWorkspace.workspace == workspace?.workspace &&
    newWorkspace.description == workspace?.description

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
      queryClient.invalidateQueries({ queryKey: [WORKSPACES_QUERY_KEY] })
      setLoading(false)
      notify('success', 'Changes Saved!')
      return
    }

    notify('error', 'Failed to Update Workspace!')
    setLoading(false)
  }

  async function handleDeleteWorkspace() {
    setDeleteLoading(true)

    if (deleteWorkspaceName !== workspace?.workspace) {
      setDeleteLoading(false)
      setDeleteError({
        status: true,
        message: 'Type the workspace name to confirm delete',
      })

      return
    }

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

  // CLEAR ERROR STATE
  useEffect(() => {
    setDeleteError({ status: false, message: '' })

    return () => {
      setDeleteError({ status: false, message: '' })
    }
  }, [deleteWorkspaceName])

  return (
    <>
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="flex flex-col gap-6 ">
          <form
            onSubmit={handleUpdateWorkspace}
            role={'edit-workspace-details'}
            className="flex w-full flex-col gap-4 sm:items-start md:flex-row md:items-end"
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
                isDisabled={loading || isSandbox || noChangesToSave}
                isLoading={loading}
                loadingText={'Saving...'}
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
            If you wish to deactivate or delete your workspace. This action can
            only be reversed by contacting our support team. Please note that
            all information related to this workspace will be retained for audit
            purposes in accordance with regulatory requirements.
          </p>
        </div>

        <Button
          color="danger"
          type="submit"
          onClick={onOpen}
          className="self-end rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
        >
          Yes, deactivate my workspace
        </Button>
      </div>

      {/* MODALS */}
      {isOpen && (
        <PromptModal
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          title="Delete/Deactivate Workspace"
          onConfirm={handleDeleteWorkspace}
          confirmText="Deactivate"
          isDisabled={deleteLoading}
          isLoading={deleteLoading}
          isDismissable={false}
        >
          <p className="leading-2 m-0">
            <strong>Are you sure you want to perform this action?</strong>
          </p>
          <p className="text-sm text-slate-700">
            This action cannot be undone. Please type{' '}
            <code className="rounded-md bg-primary/10 p-1 px-2 font-medium text-primary-700">
              {workspace?.workspace}
            </code>{' '}
            to confirm your choice to proceed.
          </p>

          <Input
            label="Confirm Delete"
            isDisabled={deleteLoading}
            onError={deleteError.status}
            errorText={deleteError.message}
            onChange={(e) => setDeleteWorkspaceName(e.target.value)}
          />
        </PromptModal>
      )}
    </>
  )
}

export default WorkspaceDetails
