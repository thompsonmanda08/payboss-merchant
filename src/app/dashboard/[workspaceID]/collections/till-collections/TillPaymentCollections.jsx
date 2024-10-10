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
  QrCodeIcon,
  ArrowDownTrayIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline'
import { Chip, Spinner, Tooltip, useDisclosure } from '@nextui-org/react'
import { cn, formatDate, maskString, notify } from '@/lib/utils'
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
import { useTillNumber, useWorkspaceAPIKey } from '@/hooks/useQueryHooks'
import {
  generateWorkspaceTillNumer,
  refreshWorkspaceAPIKey,
  setupWorkspaceAPIKey,
} from '@/app/_actions/workspace-actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TILL_COLLECTIONS_QUERY_KEY,
  WORKSPACE_TILL_NUMBER_QUERY_KEY,
} from '@/lib/constants'
import { getTillCollectionsLatestTransactions } from '@/app/_actions/transaction-actions'
import LoadingPage from '@/app/loading'
import Card from '@/components/base/Card'
import CardHeader from '@/components/base/CardHeader'
import TillNumberBanner from './TillNumberBanner'
import SoftBoxIcon from '@/components/base/SoftBoxIcon'

export const API_KEY_TRANSACTION_COLUMNS = [
  { name: 'DATE', uid: 'created_at', sortable: true },
  { name: 'TRANSACTION ID', uid: 'transactionID' },
  { name: 'SERVICE PROVIDER', uid: 'service_provider' },
  { name: 'NARRATION', uid: 'narration' },
  { name: 'MNO REF.', uid: 'mno_ref' },
  // { name: 'MNO STATUS DESCRIPTION', uid: 'mno_status_description' },
  { name: 'SOURCE ACCOUNT', uid: 'destination', sortable: true },

  { name: 'REMARKS', uid: 'status_description' },
  { name: 'AMOUNT', uid: 'amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
]

export default function TillPaymentCollections({ workspaceID }) {
  const queryClient = useQueryClient()
  const { data: tillNumberResponse, isFetching } = useTillNumber(workspaceID)
  const { onOpen, onClose } = useDisclosure()
  const [copiedKey, setCopiedKey] = useState(null)
  const [apiKey, setApiKey] = useState([])
  const [apiKeyData, setApiKeyData] = useState([])
  const [isDelete, setIsDelete] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [unmaskAPIKey, setUnmaskAPIKey] = useState(false)
  const [openViewConfig, setOpenViewConfig] = useState(false)

  const thirtyDaysAgoDate = new Date()
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30)
  const start_date = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD')
  const end_date = formatDate(new Date(), 'YYYY-MM-DD')

  // HANDLE FETCH TILL_NUMBER COLLECTION LATEST TRANSACTION DATA
  const mutation = useMutation({
    mutationKey: [TILL_COLLECTIONS_QUERY_KEY, workspaceID],
    mutationFn: (dateRange) =>
      getTillCollectionsLatestTransactions(workspaceID, dateRange),
  })

  const TILL_NUMBER = useMemo(() => {
    if (!tillNumberResponse?.success) return []
    return tillNumberResponse?.data?.til || tillNumberResponse?.data?.till
  }, [tillNumberResponse])

  async function handleUserAction() {
    setIsLoading(true)
    // THERE CAN ONLY BE ONE TILL_NUMBER KEY
    if (apiKey?.name && isNew) {
      notify('error', 'You already have an Till Number for this workspace!')
      return
    }

    const response = await generateWorkspaceTillNumer(workspaceID)

    if (!response?.success) {
      notify('error', 'Failed to generate Till Number!')
      notify('error', response?.message)
      setIsLoading(false)
      return
    }

    queryClient.invalidateQueries()

    setApiKeyData(response?.data)
    setApiKey(response?.data)
    notify('success', 'Till Number has been generated!')
    setIsLoading(false)
    setIsNew(false)

    return
  }

  useEffect(() => {
    if (TILL_NUMBER) {
      setApiKeyData(tillNumberResponse?.data)
      setApiKey(TILL_NUMBER)
    }
  }, [TILL_NUMBER])

  useEffect(() => {
    // IF NO DATA IS FETCH THEN GET THE LATEST TRANSACTIONS
    if (!mutation.data) {
      mutation.mutateAsync({ start_date, end_date })
    }
  }, [])

  const LATEST_TRANSACTIONS = mutation.data?.data?.data || []

  // return (
  //   <TillNumberBanner
  //     // configData={apiKeyData}
  //     // isLoading={isFetching}
  //     isOpen={true}
  //     onClose={() => {
  //       setOpenViewConfig(false)
  //       onClose()
  //     }}
  //   />
  // )

  return isFetching ? (
    <LoadingPage />
  ) : (
    <>
      <TillNumberBanner
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
              title={'Till Number Collections'}
              infoText={
                'Use the till number to collect payments to your workspace wallet.'
              }
              classNames={{
                titleClasses: 'xl:text-2xl lg:text-xl font-bold',
                infoClasses: '!text-sm xl:text-base',
              }}
            />
            <Button
              isDisabled={Boolean(TILL_NUMBER)}
              endContent={<PlusIcon className="h-5 w-5" />}
              onClick={() => setIsNew(true)}
            >
              Generate Till Number
            </Button>
          </div>

          <Table removeWrapper aria-label="TILL_NUMBER KEY TABLE">
            <TableHeader>
              <TableColumn width={'70%'}>TILL NUMBER</TableColumn>
              <TableColumn width={'30%'}>SHORT CODE</TableColumn>
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isFetching}
              loadingContent={
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3 ">
                  <span className="flex gap-4 text-sm font-bold capitalize text-primary">
                    <Spinner size="sm" /> Loading till number...
                  </span>
                </div>
              }
              emptyContent={
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3 ">
                  <span className="flex gap-4 text-sm font-bold capitalize text-neutral-400 ">
                    You have no till number generated
                  </span>
                </div>
              }
            >
              {TILL_NUMBER != [] ? (
                <TableRow name="1">
                  <TableCell>
                    <Button
                      isDisabled
                      className={cn(
                        'flex h-auto w-full justify-start gap-4  bg-transparent p-2 opacity-100 hover:border-primary-200 hover:bg-primary-100',
                      )}
                      startContent={
                        <SoftBoxIcon className={'h-12 w-12'}>
                          <QrCodeIcon />
                        </SoftBoxIcon>
                      }
                    >
                      <h3 className="mb-1 text-[clamp(2rem,1vw,2.5rem)] font-black uppercase text-primary-600">
                        {TILL_NUMBER}
                      </h3>
                    </Button>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      color="primary"
                      className="flex flex-row items-center text-[clamp(1.25rem,1vw,2rem)]"
                    >
                      <span>*</span> 484 <span>*</span>
                      <span className="text-[clamp(1rem,1vw,1.5rem)] font-bold">{` ${TILL_NUMBER} * `}</span>
                      [
                      <span className="text-[clamp(1rem,1vw,1.5rem)] font-bold">
                        {' '}
                        AMOUNT{' '}
                      </span>
                      ] #
                    </Chip>
                  </TableCell>

                  <TableCell>
                    <>
                      <div className="flex items-center gap-4">
                        <Tooltip
                          color="secondary"
                          content="Till Number Banner Download"
                        >
                          <span className="rounded-md bg-secondary/10 p-2 transition-all duration-300 ease-in-out hover:bg-secondary/20">
                            {' '}
                            <ArrowDownTrayIcon
                              onClick={() => setOpenViewConfig(true)}
                              className="h-6 w-6 cursor-pointer text-secondary hover:opacity-90"
                            />
                          </span>
                        </Tooltip>
                        <Tooltip
                          color="default"
                          content="View Till Number Banner"
                        >
                          {/* BANNER DISPLAY */}
                          <span className="rounded-md bg-primary/10 p-2 text-primary transition-all duration-300 ease-in-out hover:bg-primary/20">
                            <ComputerDesktopIcon
                              className={`h-6 w-6 cursor-pointer`}
                              // onClick={() => copyToClipboard(apiKey?.name)}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    </>
                  </TableCell>
                </TableRow>
              ) : (
                <div className="relative top-6 mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-50 py-3 ">
                  <span className="flex gap-4 text-sm font-bold capitalize text-neutral-400 ">
                    You have no till number generated
                  </span>
                </div>
              )}
            </TableBody>
          </Table>

          <div>
            <CardHeader
              className={'my-4'}
              title={'Recent Transactions'}
              infoText={
                'Transactions made to your workspace wallet in the last 30days.'
              }
            />
            <CustomTable
              columns={API_KEY_TRANSACTION_COLUMNS}
              rows={LATEST_TRANSACTIONS || []}
              rowsPerPage={6}
              isLoading={mutation.isPending}
              removeWrapper
            />
          </div>
        </Card>
      </div>
      {/* MODALS */}
      <PromptModal
        isOpen={isNew}
        onOpen={onOpen}
        onClose={() => {
          onClose()
          setIsNew(false)
        }}
        title={'Generate New Till Number '}
        onConfirm={handleUserAction}
        confirmText={'Generate'}
        isDisabled={isLoading}
        isLoading={isLoading}
        isDismissable={false}
      >
        <p className="-mt-4 text-sm leading-6 text-slate-700">
          <strong>Are you sure you want to generate a new Till number?</strong>
          <br />
          This till number will allow you collect funds to your workspace wallet
          from 3rd party applications and interfaces.
        </p>
      </PromptModal>
    </>
  )
}
