'use client'
import { WorkspaceItem } from '@/components/base'
import { Button } from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { useSetupConfig } from '@/hooks/useQueryHooks'
import { cn, notify } from '@/lib/utils'
import { PlusIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react'
import { Input } from '@/components/ui/InputField'
import { createNewWorkspace } from '@/app/_actions/config-actions'
import { useQueryClient } from '@tanstack/react-query'
import { SETUP_QUERY_KEY } from '@/lib/constants'
import { usePathname, useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import useWorkspace from '@/hooks/useWorkspace'

function Workspaces() {
  const { push } = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { activeWorkspace } = useWorkspace()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { data: response, isLoading, isSuccess } = useSetupConfig()
  const { workspaces, userDetails } = response?.data || []

  const INITIAL_WORKSPACE = {
    workspace: '',
    description: '',
    merchantID: userDetails?.merchantID,
  }

  const isWorkspaceSettings =
    pathname.split('/')[2] == 'workspaces' ||
    pathname.split('/')[2] == 'workspaces'

  // console.log(response)

  const [loading, setLoading] = useState(false)
  const [newWorkspace, setNewWorkspace] = useState(INITIAL_WORKSPACE)

  function editWorkspaceField(fields) {
    setNewWorkspace((prev) => {
      return { ...prev, ...fields }
    })
  }

  function handleClose(onClose) {
    setNewWorkspace(INITIAL_WORKSPACE)

    onClose()
  }

  async function handleCreateWorkspace() {
    setLoading(true)

    if (
      newWorkspace.workspace.length <= 3 &&
      newWorkspace.description.length <= 3
    ) {
      notify('error', 'Provide valid name and description!')
      setLoading(false)
    }

    const response = await createNewWorkspace(newWorkspace)

    if (!response.success) {
      notify('error', 'Failed to Create Workspace!')
      setLoading(false)
      return
    }

    queryClient.invalidateQueries({ queryKey: [SETUP_QUERY_KEY] })
    notify('success', 'Workspace Created!')
    setLoading(false)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center ">
      <ScrollArea className="flex w-full min-w-[400px] flex-col lg:max-h-[400px] lg:px-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <Spinner size={48} color="#1B64CE" />
            <p className="mt-8 max-w-sm break-words font-bold text-slate-800">
              Loading Workspaces...
            </p>
          </div>
        ) : (
          <div
            className={cn('grid w-full place-items-center gap-4 rounded-lg', {
              'grid-cols-[repeat(auto-fill,minmax(400px,1fr))]':
                workspaces?.length > 0,
            })}
          >
            {workspaces &&
              workspaces?.map((item) => {
                return (
                  <WorkspaceItem
                    name={item?.workspace}
                    href={
                      !isWorkspaceSettings
                        ? `/dashboard/${item?.ID}`
                        : pathname + `/${item?.ID}`
                    }
                  />
                )
              })}

            <Button
              onPress={onOpen}
              className={cn(
                'h-24 w-full flex-col border border-primary-100 bg-transparent font-medium text-primary hover:border-primary-100 hover:bg-primary-50',
                { 'col-span-full': workspaces?.length < 0 },
              )}
            >
              <PlusIcon className=" h-6 w-6" />
              Create Workspace
            </Button>
          </div>
        )}
      </ScrollArea>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Workspace
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Workspace Name"
                  placeholder="Commercial Team"
                  className="mt-px"
                  onChange={(e) => {
                    editWorkspaceField({ workspace: e.target.value })
                  }}
                />
                <Input
                  label="Description"
                  placeholder="Describe the workspace"
                  onChange={(e) => {
                    editWorkspaceField({ description: e.target.value })
                  }}
                  className="mt-px"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={() => handleClose(onClose)}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={loading}
                  isDisabled={loading}
                  onPress={() => handleCreateWorkspace(onClose)}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Workspaces
