'use client'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  PlusIcon,
  Square2StackIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { Spinner, Tooltip, useDisclosure } from '@nextui-org/react'
import { maskString, notify } from '@/lib/utils'
import { Card, CardHeader } from '@/components/base'
import PromptModal from '@/components/base/Prompt'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react'
import CustomTable from '@/components/containers/tables/Table'
import { useWorkspaceAPIKey } from '@/hooks/useQueryHooks'
import {
  refreshWorkspaceAPIKey,
  setupWorkspaceAPIKey,
} from '@/app/_actions/workspace-actions'
import { useQueryClient } from '@tanstack/react-query'
import { WORKSPACE_API_KEY_QUERY_KEY } from '@/lib/constants'
import APIConfigViewModal from './APIConfigView'

export const API_KEY_TRANSACTION_COLUMNS = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'SERVICE', uid: 'service' },
  { name: 'SERVICE PROVIDER', uid: 'service_provider' },
  { name: 'SOURCE ACCOUNT', uid: 'destination', sortable: true },

  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
]

const APIIntegration = ({ workspaceID }) => {
  const queryClient = useQueryClient()
  const {
    data: apiKeyResponse,
    isFetching,
    isSuccess,
  } = useWorkspaceAPIKey(workspaceID)
  const { onOpen, onClose } = useDisclosure()
  const [copiedKey, setCopiedKey] = useState(null)
  const [apiKey, setApiKey] = useState([])
  const [apiKeyData, setApiKeyData] = useState([])
  const [isDelete, setIsDelete] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [isRefresh, setIsRefresh] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [unmaskAPIKey, setUnmaskAPIKey] = useState(false)
  const [openViewConfig, setOpenViewConfig] = useState(false)

  console.log(apiKeyResponse?.data)

  const API = useMemo(() => {
    if (!apiKeyResponse?.success) return []
    return {
      apiKey: apiKeyResponse?.data?.apiKey,
      username: apiKeyResponse?.data?.username,
    }
  }, [apiKeyResponse])

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    notify('success', 'Copied to clipboard')
  }

  async function handleUserAction() {
    setIsLoading(true)
    // THERE CAN ONLY BE ONE API KEY
    if (apiKey != null && isNew) {
      notify('error', 'You already have an API key for this workspace!')
      return
    }

    // HIT THE BACKEND TO UPDATE THE API KEY
    if (isRefresh && apiKey != null) {
      const response = await refreshWorkspaceAPIKey(workspaceID)

      if (!response.success) {
        notify('error', 'Failed to refresh API key!')
        setIsLoading(false)
        return
      }

      queryClient.invalidateQueries({
        queryKey: [WORKSPACE_API_KEY_QUERY_KEY, workspaceID],
      })

      notify('success', 'API key has been updated!')
      setIsRefresh(false)
      setIsLoading(false)
      return
    }

    // FEATURE TO DELETE API KEY
    // if (isDelete && apiKey != null) {
    //   setApiKey(null)
    //   notify('success', 'API key has been deleted!')
    //   setIsDelete(false)
    //   setIsLoading(false)
    //   return
    // }

    const response = await setupWorkspaceAPIKey(workspaceID)

    if (!response.success) {
      notify('error', 'Failed to generate API key!')
      setIsLoading(false)
      return
    }

    queryClient.invalidateQueries({
      queryKey: [WORKSPACE_API_KEY_QUERY_KEY, workspaceID],
    })
    setApiKeyData(response?.data)
    setApiKey(response?.data?.API)
    notify('success', 'API key has been generated!')
    setIsLoading(false)
    setIsNew(false)

    return
  }

  useEffect(() => {
    if (API) {
      setApiKeyData(apiKeyResponse?.data)
      setApiKey(API)
    }
  }, [API])

  useEffect(() => {
    let timeoutId

    if (unmaskAPIKey) {
      timeoutId = setTimeout(() => {
        setUnmaskAPIKey(true)
      }, 1000 * 60)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [unmaskAPIKey])

  // return isFetching ? (
  //   <LoadingPage />
  // ) :

  return (
    <>
      <APIConfigViewModal
        configData={apiKeyData}
        isLoading={isFetching}
        isOpen={openViewConfig}
        onClose={() => {
          setOpenViewConfig(false)
          onClose()
        }}
      />
      <div className="flex w-full flex-col gap-4">
        <Card className="">
          <div className="mb-8 flex justify-between">
            <CardHeader
              title={'API Key'}
              infoText={
                'Use the API keys to collect payments to your workspace wallet.'
              }
              classNames={{
                titleClasses: 'xl:text-2xl lg:text-xl font-bold',
                infoClasses: '!text-sm xl:text-base',
              }}
            />
            <Button
              isDisabled={apiKey != null}
              endContent={<PlusIcon className="h-5 w-5" />}
              onClick={() => setIsNew(true)}
            >
              Generate Key
            </Button>
          </div>

          <Table removeWrapper aria-label="API KEY TABLE">
            <TableHeader>
              <TableColumn width={'30%'}>NAME</TableColumn>
              <TableColumn width={'65%'}>KEY</TableColumn>
              {/* <TableColumn>ENABLE</TableColumn> */}
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isFetching}
              loadingContent={
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3 ">
                  <span className="flex gap-4 text-sm font-bold capitalize text-primary">
                    <Spinner size="sm" /> Loading API key...
                  </span>
                </div>
              }
              emptyContent={
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50/50 py-3 text-xs  text-neutral-400 ">
                  You have no API keys generated
                </div>
              }
            >
              {apiKey && (
                <TableRow key="1">
                  <TableCell>{apiKey?.username}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-4 font-medium">
                      {unmaskAPIKey
                        ? apiKey?.apikey
                        : maskString(apiKey?.apikey)}
                      <Button
                        className={'h-max max-h-max max-w-max p-1'}
                        color="default"
                        variant="light"
                        size="sm"
                        onClick={() => setUnmaskAPIKey(!unmaskAPIKey)}
                      >
                        {unmaskAPIKey ? (
                          <EyeSlashIcon className="h-5 w-5 cursor-pointer text-primary" />
                        ) : (
                          <EyeIcon className="h-5 w-5 cursor-pointer text-primary" />
                        )}
                      </Button>
                    </span>
                  </TableCell>
                  {/* FEATURE TO ENABLE AND DISBALE API KEY */}
                  {/* <TableCell>
                    <Switch
                      checked={apiKey?.enabled}
                      startContent={<XMarkIcon />}
                      endContent={<CheckIcon />}
                      onChange={() =>
                        setApiKey((prev) => ({
                          ...prev,
                          enabled: !apiKey?.enabled,
                        }))
                      }
                    />
                  </TableCell> */}
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Tooltip color="secondary" content="API Config">
                        <Cog6ToothIcon
                          onClick={() => setOpenViewConfig(true)}
                          className="h-5 w-5 cursor-pointer text-secondary hover:opacity-90"
                        />
                      </Tooltip>
                      <Tooltip
                        color="default"
                        content="Copy API Key to clipboard"
                      >
                        <Square2StackIcon
                          className={`h-6 w-6 cursor-pointer ${
                            copiedKey === apiKey?.key
                              ? 'text-primary'
                              : 'text-gray-500'
                          } hover:text-primary`}
                          onClick={() => copyToClipboard(apiKey?.key)}
                        />
                      </Tooltip>
                      <Tooltip color="primary" content="Refresh API Key">
                        <ArrowPathIcon
                          onClick={() => setIsRefresh(true)}
                          className="h-5 w-5 cursor-pointer text-primary hover:text-primary-300"
                        />
                      </Tooltip>
                      {/*  FEATURE TO DELETE AN API KEY */}
                      {/* <Tooltip color="danger" content="Delete API Key">
                        <TrashIcon
                          onClick={() => setIsDelete(true)}
                          className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-300"
                        />
                      </Tooltip> */}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <PromptModal
            isOpen={isNew || isDelete || isRefresh}
            onOpen={onOpen}
            onClose={() => {
              onClose()
              setIsNew(false)
              setIsDelete(false)
              setIsRefresh(false)
            }}
            title={
              isNew
                ? 'Generate New API Key'
                : isDelete
                  ? 'Delete API Key'
                  : isRefresh
                    ? 'Refresh API Key'
                    : 'API Keys'
            }
            onConfirm={handleUserAction}
            confirmText={
              isNew
                ? 'Generate'
                : isDelete
                  ? 'Delete'
                  : isRefresh
                    ? 'Refresh'
                    : 'Confirm'
            }
            isDisabled={isLoading}
            isLoading={isLoading}
            isDismissable={false}
          >
            {isDelete ? (
              <>
                <p className="-mt-4 text-sm leading-6 text-slate-700">
                  <strong>Are you sure you want to delete this API Key?</strong>{' '}
                  <br />
                  This action is not reversible and will result in the
                  non-operation of this key. Make sure you update any
                  application making use of this Key.
                </p>
              </>
            ) : isNew ? (
              <p className="-mt-4 text-sm leading-6 text-slate-700">
                <strong>
                  Are you sure you want to generate a new API key?
                </strong>
                <br />
                This API key will allow you channel funds to your workspace
                wallet from 3rd party applications and interfaces.
              </p>
            ) : (
              <p className="-mt-4 text-sm leading-6 text-slate-700">
                <strong>Are you sure you want to refresh this API key?</strong>
                <br />
                By confirming this, your API key will be changed to a new one
                and you will not be able to use the old API anymore.
              </p>
            )}
          </PromptModal>
        </Card>

        <CustomTable columns={API_KEY_TRANSACTION_COLUMNS} rows={[]} />
      </div>
    </>
  )
}

export default APIIntegration
