'use client'
import { Button } from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
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
import { SETUP_QUERY_KEY, WORKSPACES_QUERY_KEY } from '@/lib/constants'
import { usePathname, useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import useWorkspace from '@/hooks/useWorkspace'
import useAccountProfile from '@/hooks/useProfileDetails'
import WorkspaceItem from './WorkspaceItem'
import OverlayLoader from '@/components/ui/OverlayLoader'
import { InfoBanner } from '@/components/base'
import CreateNewWorkspaceModal from './CreateNewWorkspce'

function Workspaces() {
  const { push } = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { activeWorkspace, workspaces, allWorkspaces, isLoading } =
    useWorkspace()

  const { isOwner, isAccountAdmin } = useAccountProfile()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const isWorkspaceSettings =
    pathname.split('/').length > 2 &&
    (pathname.split('/')[2] == 'workspaces' ||
      pathname.split('/')[4] == 'workspaces')

  const RENDER_WORKSPACES =
    pathname.split('/').length > 2 ? allWorkspaces : workspaces

  const [loading, setLoading] = useState(false)
  const [newWorkspace, setNewWorkspace] = useState({})

  function editWorkspaceField(fields) {
    setNewWorkspace((prev) => {
      return { ...prev, ...fields }
    })
  }

  function handleClose(onClose) {
    setNewWorkspace({})
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

    if (response.success) {
      queryClient.invalidateQueries({
        queryKey: [SETUP_QUERY_KEY],
      })
      queryClient.invalidateQueries({ queryKey: [WORKSPACES_QUERY_KEY] })
      notify('success', 'Workspace Created!')
      onOpenChange()
      setLoading(false)
      return
    }

    notify('error', 'Failed to Create Workspace!')
    notify('error', response.message)

    setLoading(false)
    onOpenChange()
  }

  return (
    <>
      {/* ACCOUNT VERIFICATION PROMPTING BANNER */}
      <InfoBanner
        buttonText="Verify Account"
        infoText="You have not verified your account yet. Please verify your account to access all the features of the app."
        href={'manage-account/account-verification'}
      />

      <div className="flex w-full flex-col items-center justify-center">
        <ScrollArea
          className={cn(
            'flex w-full min-w-[400px] flex-col lg:max-h-[400px] lg:px-2',
            { 'max-h-auto lg:max-h-max ': isWorkspaceSettings },
          )}
        >
          {isLoading ? (
            <div className="flex h-full min-h-[400px] flex-1 flex-col items-center justify-center p-10 text-center">
              <div>
                <Spinner size={48} color="#1B64CE" />
                <p className="mt-4 max-w-sm break-words font-bold text-slate-800">
                  Loading Workspaces...
                </p>
              </div>
            </div>
          ) : (
            <div
              className={cn('grid w-full place-items-center gap-4 rounded-lg', {
                'grid-cols-[repeat(auto-fill,minmax(400px,1fr))]':
                  workspaces?.length > 0,
              })}
            >
              {RENDER_WORKSPACES &&
                RENDER_WORKSPACES?.map((item) => {
                  return (
                    <WorkspaceItem
                      onClick={() => setLoading(true)}
                      name={item?.workspace}
                      isVisible={item?.isVisible}
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
      </div>

      {/* OVERLAYS AND MODALS  */}
      {loading && <OverlayLoader show={loading} />}
      <CreateNewWorkspaceModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleCreateWorkspace={handleCreateWorkspace}
        handleClose={handleClose}
        editWorkspaceField={editWorkspaceField}
        loading={loading}
      />
    </>
  )
}

export default Workspaces
