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
import CardHeader from '@/components/base/CardHeader'
import Card from '@/components/base/Card'

export const TILL_TRANSACTION_COLUMNS = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'SERVICE PROVIDER', uid: 'service_provider' },
  { name: 'SOURCE', uid: 'destination', sortable: true },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
]

const TillPaymentCollections = () => {
  const [copiedKey, setCopiedKey] = useState(null)
  const [tillNumber, setTillNumber] = useState(null)
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
    // THERE CAN ONLY BE ONE Till Number
    if (tillNumber != null && isNew) {
      notify('error', 'You already have an Till Number for this workspace!')
      return
    }

    // HIT THE BACKEND TO UPDATE THE Till Number
    if (isRefresh && tillNumber != null) {
      const key = {
        name: 'new-name',
        key: Math.random().toString(36).substring(2, 30),
        enabled: true,
      }
      setTillNumber(key)
      notify('success', 'Till Number has been updated!')
      setIsRefresh(false)
      setIsLoading(false)
      return
    }

    // HIT BACKEND TO DELETE Till Number
    if (isDelete && tillNumber != null) {
      setTillNumber(null)
      notify('success', 'Till Number has been deleted!')
      setIsDelete(false)
      setIsLoading(false)
      return
    }

    // HIT THE BACKEND TO GENERATE NEW Till Number
    const key = {
      name: 'username',
      key: Math.random().toString(36).substring(2, 30),
      enabled: true,
    }
    setTillNumber(key)
    notify('success', 'Till Number has been generated!')
    setIsLoading(false)
    setIsNew(false)

    return
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Card className="">
        <div className="mb-8 flex justify-between">
          <CardHeader
            title={'Till Numbers'}
            infoText={
              'Use the Till Number to collect payments made to your workspace wallet.'
            }
            classNames={{
              titleClasses: 'xl:text-2xl lg:text-xl font-bold',
              infoClasses: '!text-sm xl:text-base',
            }}
          />
          <Button
            isDisabled={tillNumber != null}
            endContent={<PlusIcon className="h-5 w-5" />}
            onClick={() => setIsNew(true)}
          >
            Create Till Number
          </Button>
        </div>

        <Table removeWrapper aria-label="Till Number TABLE">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>KEY</TableColumn>
            <TableColumn>ENABLE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'You have no Till Number generated'}>
            {tillNumber && (
              <TableRow key="1">
                <TableCell>{tillNumber?.name}</TableCell>
                <TableCell>{tillNumber?.key}</TableCell>
                <TableCell>
                  <Switch
                    checked={tillNumber?.enabled}
                    startContent={<XMarkIcon />}
                    endContent={<CheckIcon />}
                    onChange={() =>
                      setTillNumber((prev) => ({
                        ...prev,
                        enabled: !tillNumber?.enabled,
                      }))
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Tooltip
                      color="default"
                      content="Copy Till Number to clipboard"
                    >
                      <Square2StackIcon
                        className={`h-6 w-6 cursor-pointer ${
                          copiedKey === tillNumber?.key
                            ? 'text-primary'
                            : 'text-gray-500'
                        } hover:text-primary`}
                        onClick={() => copyToClipboard(tillNumber?.key)}
                      />
                    </Tooltip>
                    {/* <Tooltip color="primary" content="Refresh Till Number">
                      <ArrowPathIcon
                        onClick={() => setIsRefresh(true)}
                        className="h-5 w-5 cursor-pointer text-primary hover:text-primary-300"
                      />
                    </Tooltip> */}
                    <Tooltip color="danger" content="Delete Till Number">
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
              ? 'Create New Till Number'
              : isDelete
                ? 'Delete Till Number'
                : isRefresh
                  ? 'Refresh Till Number'
                  : 'Till Number'
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
                <strong>
                  Are you sure you want to delete this Till Number?
                </strong>{' '}
                <br />
                This action is not reversible and will result in the
                non-operation of this key.
              </p>
            </>
          ) : isNew ? (
            <p className="-mt-4 text-sm leading-6 text-slate-700">
              <strong>
                Are you sure you want to generate a new Till Number?
              </strong>
              <br />
              This Till Number will allow you channel funds to your workspace
              wallet from 3rd party applications and interfaces.
            </p>
          ) : (
            <p className="-mt-4 text-sm leading-6 text-slate-700">
              <strong>
                Are you sure you want to refresh this Till Number?
              </strong>
              <br />
              By confirming this, your Till Number will be changed to a new one
              and you will not be able to use the old Till Number anymore.
            </p>
          )}
        </PromptModal>
      </Card>

      <CustomTable columns={TILL_TRANSACTION_COLUMNS} rows={[]} />
    </div>
  )
}

export default TillPaymentCollections
