'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  Square2StackIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { Switch, Tooltip, useDisclosure } from '@nextui-org/react'
import { notify } from '@/lib/utils'
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

export const API_KEY_TRANSACTION_COLUMNS = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'SERVICE', uid: 'service' },
  { name: 'SERVICE PROVIDER', uid: 'service_provider' },
  { name: 'SOURCE ACCOUNT', uid: 'destination', sortable: true },

  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
]

const APIIntegration = () => {
  const [copiedKey, setCopiedKey] = useState(null)
  const [apiKey, setApiKey] = useState(null)
  const [isDelete, setIsDelete] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [isRefresh, setIsRefresh] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { onOpen, onClose } = useDisclosure()

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    notify('success', 'Copied to clipboard')
  }

  function handleUserAction() {
    setIsLoading(true)
    // THERE CAN ONLY BE ONE API KEY
    if (apiKey != null && isNew) {
      notify('error', 'You already have an API key for this workspace!')
      return
    }

    // HIT THE BACKEND TO UPDATE THE API KEY
    if (isRefresh && apiKey != null) {
      const key = {
        name: 'new-name',
        key: Math.random().toString(36).substring(2, 30),
        enabled: true,
      }
      setApiKey(key)
      notify('success', 'API key has been updated!')
      setIsRefresh(false)
      setIsLoading(false)
      return
    }

    // HIT BACKEND TO DELETE API KEY
    if (isDelete && apiKey != null) {
      setApiKey(null)
      notify('success', 'API key has been deleted!')
      setIsDelete(false)
      setIsLoading(false)
      return
    }

    // HIT THE BACKEND TO GENERATE NEW API KEY
    const key = {
      name: 'username',
      key: Math.random().toString(36).substring(2, 30),
      enabled: true,
    }
    setApiKey(key)
    notify('success', 'API key has been generated!')
    setIsLoading(false)
    setIsNew(false)

    return
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Card className="">
        <div className="mb-8 flex justify-between">
          <CardHeader
            title={'API Keys'}
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
            <TableColumn>NAME</TableColumn>
            <TableColumn>KEY</TableColumn>
            <TableColumn>ENABLE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'You have no API keys generated'}>
            {apiKey && (
              <TableRow key="1">
                <TableCell>{apiKey?.name}</TableCell>
                <TableCell>{apiKey?.key}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
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
                    <Tooltip color="danger" content="Delete API Key">
                      <TrashIcon
                        onClick={() => setIsDelete(true)}
                        className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-300"
                      />
                    </Tooltip>
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
                non-operation of this key. Make sure you update any application
                making use of this Key.
              </p>
            </>
          ) : isNew ? (
            <p className="-mt-4 text-sm leading-6 text-slate-700">
              <strong>Are you sure you want to generate a new API key?</strong>
              <br />
              This API key will allow you channel funds to your workspace wallet
              from 3rd party applications and interfaces.
            </p>
          ) : (
            <p className="-mt-4 text-sm leading-6 text-slate-700">
              <strong>Are you sure you want to refresh this API key?</strong>
              <br />
              By confirming this, your API key will be changed to a new one and
              you will not be able to use the old API anymore.
            </p>
          )}
        </PromptModal>
      </Card>

      <CustomTable columns={API_KEY_TRANSACTION_COLUMNS} rows={[]} />
    </div>
  )
}

export default APIIntegration
