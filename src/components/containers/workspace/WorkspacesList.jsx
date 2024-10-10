'use client'
import { Button } from '@/components/ui/Button'
import { capitalize, cn, notify } from '@/lib/utils'
import { PlusIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { useDisclosure } from '@nextui-org/react'
import { createNewWorkspace } from '@/app/_actions/config-actions'
import { useQueryClient } from '@tanstack/react-query'
import { SETUP_QUERY_KEY, WORKSPACES_QUERY_KEY } from '@/lib/constants'
import { usePathname } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import useWorkspace from '@/hooks/useWorkspaces'
import WorkspaceItem from './WorkspaceItem'
import OverlayLoader from '@/components/ui/OverlayLoader'
import CreateNewWorkspaceModal from './CreateNewWorkspace'
import Loader from '@/components/ui/Loader'
import useAccountProfile from '@/hooks/useProfileDetails'
import Card from '@/components/base/Card'
import InfoBanner from '@/components/base/InfoBanner'

function Workspaces({ user, showHeader = false, className }) {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { KYCStageID } = useAccountProfile()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const canCreateWorkspace =
    (user?.role?.toLowerCase() == 'admin' ||
      user?.role?.toLowerCase() == 'owner') &&
    KYCStageID == 4

  const [loading, setLoading] = useState(false)
  const [newWorkspace, setNewWorkspace] = useState({
    workspace: '',
    description: '',
    workspaceType: 'collection',
  })

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

    if (response?.success) {
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
    notify('error', response?.message)

    setLoading(false)
    onOpenChange()
  }

  return (
    <>
      <Card className={cn('gap-6', className)}>
        {showHeader && (
          <div className="flex justify-between bg-red-500/0">
            <div>
              <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
                Choose a Workspace
              </h2>
              <p className=" text-sm text-slate-600">
                Access your account through a workspace for the convenience of
                having all your tools and resources organized in one place.
              </p>
            </div>
            {canCreateWorkspace && (
              <Button
                onPress={onOpen}
                size="lg"
                isDisabled={loading}
                endContent={<PlusIcon className=" h-5 w-5" />}
                variant="flat"
                color="primary"
                className={'mt-auto bg-primary-50 px-4'}
              >
                New
              </Button>
            )}
          </div>
        )}

        {/* ACCOUNT VERIFICATION PROMPTING BANNER */}
        <InfoBanner
          buttonText="Submit Documents"
          infoText="Just one more step, please submit your business documents to aid us with the approval process"
          href={'manage-account/account-verification'}
        />

        <ListOfWorkspaces
          pathname={pathname}
          loading={loading}
          setLoading={setLoading}
          allowCreateWorkspaces={canCreateWorkspace}
          openModal={onOpen}
        />
      </Card>

      {/* OVERLAYS AND MODALS  */}
      {<OverlayLoader show={loading} />}
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

export function ListOfWorkspaces({
  loading,
  setLoading,
  allowCreateWorkspaces,
  createFromList = false,
  openModal,
}) {
  const { workspaces, allWorkspaces, isLoading } = useWorkspace()
  const pathname = usePathname()
  const RENDER_WORKSPACES =
    pathname?.split('/')?.length > 2 ? allWorkspaces : workspaces

  const isWorkspaceSettings = pathname.split('/').includes('manage-account')

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <ScrollArea
        className={cn(
          'flex w-full min-w-[400px] flex-col lg:max-h-[500px] lg:px-2',
          { 'max-h-auto lg:max-h-max ': isWorkspaceSettings },
        )}
      >
        {isLoading ? (
          <Loader size={80} loadingText={'Loading Workspaces...'} />
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
                    description={`${capitalize(item?.workspaceType)}'s Workspace`}
                    isVisible={item?.isVisible}
                    href={
                      `/dashboard/${item?.ID}`
                      // !isWorkspaceSettings
                      //   ? `/dashboard/${item?.ID}`
                      //   : `manage-account/workspaces/${item?.ID}`
                    }
                  />
                )
              })}

            {allowCreateWorkspaces && createFromList && (
              <Button
                onPress={openModal}
                className={cn(
                  'h-24 w-full flex-col border border-primary-100 bg-transparent font-medium text-primary hover:border-primary-100 hover:bg-primary-50',
                  { 'col-span-full': workspaces?.length < 0 },
                )}
              >
                <PlusIcon className=" h-6 w-6" />
                Create Workspace
              </Button>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default Workspaces
