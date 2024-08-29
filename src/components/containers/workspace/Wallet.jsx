import {
  Balance,
  Card,
  CardHeader,
  EmptyLogs,
  StatusMessage,
} from '@/components/base'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/InputField'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import { UploadField } from '../account-verification/DocumentAttachments'
import { capitalize, cn, formatCurrency, formatDate, notify } from '@/lib/utils'
import { TASK_TYPE } from '@/lib/constants'
import { formatActivityData } from '@/lib/utils'
import PromptModal from '@/components/base/Prompt'
import { Chip, Tooltip, useDisclosure } from '@nextui-org/react'
import { uploadPOPDocument } from '@/app/_actions/pocketbase-actions'
import { submitPOP } from '@/app/_actions/workspace-actions'
import DateSelectField from '@/components/ui/DateSelectField'
import { getLocalTimeZone, today } from '@internationalized/date'
import useTransactions from '@/hooks/useTransactions'
import { Skeleton } from '@/components/ui/skeleton'

const POP_INIT = {
  amount: 0,
  bank_rrn: '',
  date_of_deposit: '',
  url: '',
}

function Wallet({ workspaceID, workspaceName, balance, hideHistory }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure()

  const [formData, setFormData] = React.useState(POP_INIT)

  const [error, setError] = React.useState({
    status: '',
    message: '',
  })

  function updateFormData(fields) {
    setFormData((prevData) => ({
      ...prevData,
      ...fields,
    }))
  }
  const isDisabled =
    // !formData?.amount ||
    // formData?.amount < 0 ||
    !formData?.date_of_deposit ||
    !formData?.bank_rrn ||
    !formData?.url ||
    isLoading

  async function handleFileUpload(file, recordID) {
    setIsLoading(true)
    setError({ message: '', status: '' })

    let response = await uploadPOPDocument(file, recordID)

    if (response.success) {
      setIsLoading(false)
      notify('success', response?.message)
      return response?.data
    }

    setIsLoading(false)
    notify('error', response.message)
    return null
  }

  async function handleWalletPreFund() {
    setIsLoading(true)

    if (!formData.url) {
      notify('error', 'Attach proof of payment!')
      setError({
        message: 'Verify that you have attached a proof of payment!',
        status: true,
      })
      setIsLoading(false)
      onClose()
      return
    }

    const response = await submitPOP(formData, workspaceID)

    if (response.success) {
      notify('success', 'POP Completed successfully!')
      setIsLoading(false)
      setFormData(POP_INIT)
      onClose()
      setIsLoading(false)
      return
    }

    setError({
      status: true,
      message: response?.message,
    })
    notify('error', response?.message)
    setIsLoading(false)
    return
  }

  return (
    <>
      <section role="wallet-section" className="grid w-full place-items-center">
        <Card
          className={cn(
            'container flex w-full flex-col items-start justify-center gap-8 md:flex-row',
            {
              'items-center justify-center gap-x-0': hideHistory,
            },
          )}
        >
          <div
            className={cn('flex w-full max-w-md flex-1 flex-col gap-4', {
              'mx-auto': hideHistory,
            })}
          >
            <Balance
              title={`${workspaceName} Wallet`}
              amount={balance}
              isLandscape
            />
            <div
              className={cn(
                'flex w-full flex-col gap-y-4 p-[25px] lg:border lg:border-y-0 lg:border-l-0 lg:border-border',
                {
                  'lg:border-r-0': hideHistory,
                },
              )}
            >
              <div role="pre-fund-wallet" className="flex  flex-col gap-4">
                <p className="text-[14px] font-semibold text-slate-800">
                  Deposit funds into your PayBoss Wallet
                </p>

                {/* <Input
                  type="number"
                  label="Amount"
                  value={formData.amount}
                  placeholder="Amount"
                  onChange={(e) => updateFormData({ amount: e.target.value })}
                  name="amount"
                /> */}
                <Input
                  placeholder="Bank Receipt No. "
                  label="Reference Number"
                  value={formData.bank_rrn}
                  onChange={(e) => updateFormData({ bank_rrn: e.target.value })}
                  name="bank_rrn"
                />
                <DateSelectField
                  label={'Date of Deposit'}
                  className="max-w-md"
                  description={'Date the funds were deposited'}
                  defaultValue={formData?.date_of_deposit}
                  value={
                    formData?.date_of_deposit?.split('').length > 9
                      ? formData?.date_of_deposit
                      : undefined
                  }
                  maxValue={today(getLocalTimeZone())}
                  labelPlacement={'outside'}
                  onChange={(date) => {
                    updateFormData({
                      date_of_deposit: formatDate(date, 'YYYY-MM-DD'),
                    })
                  }}
                />

                <UploadField
                  label="Proof of Payment"
                  handleFile={async (file) => {
                    const file_record = await handleFileUpload(
                      file,
                      formData.file?.file_record_id,
                    )
                    updateFormData({ url: file_record?.file_url })
                  }}
                  acceptedFiles={{
                    'application/pdf': [],
                    'image/png': [],
                    'image/jpeg': [],
                    'image/jpg': [],
                  }}
                />
                {error.status && (
                  <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
                    <StatusMessage
                      error={error.status}
                      message={error.message}
                    />
                  </div>
                )}

                <Button
                  isDisabled={isDisabled}
                  isLoading={isLoading}
                  type="button"
                  onClick={onOpen}
                >
                  Pre-Fund Wallet
                </Button>
              </div>
            </div>
          </div>
          {!hideHistory && (
            <ScrollArea className="flex h-full max-h-[600px] flex-[2] flex-grow flex-col items-start gap-8 ">
              <CardHeader
                title="Wallet Transaction History"
                infoText={
                  'Transaction history logs for every prefunding activity on the wallet'
                }
              />
              <PreFundHistory workspaceID={workspaceID} />
            </ScrollArea>
          )}
        </Card>

        <PromptModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onClose={onClose}
          onConfirm={handleWalletPreFund}
          title="Confirm POP Submission"
          confirmText="Confirm"
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          <p className="text-sm text-slate-800">
            Your wallet will be credited with the amount you deposited with ref.
            <code className="mx-1 rounded-md bg-primary/10 p-1 px-2 font-bold text-primary-700">
              {formData?.bank_rrn}
            </code>
            as soon as your transaction is verified, This will take a few
            minutes.
          </p>
        </PromptModal>
      </section>
    </>
  )
}

export function PreFundHistory({ workspaceID }) {
  const { isLoading, walletHistory } = useTransactions({
    workspaceID,
  })
  const data = [
    {
      title: 'Wallet Prefund',
      data: walletHistory,
    },
  ]

  const formattedActivityData = formatActivityData(data)

  return isLoading ? (
    <div className="flex w-full flex-col gap-4">
      <Skeleton className="mt-6 h-8 max-w-xs" />
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="flex justify-between">
          <div className="flex w-full gap-4">
            <Skeleton className="h-8 w-24" />
            <div className="flex w-full flex-col gap-2 pr-8">
              <Skeleton className="h-8 w-full max-w-60" />
              <Skeleton className="h-4 w-full max-w-lg" />
            </div>
          </div>
          <div className="flex w-fit max-w-xs flex-col items-end gap-2 ">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div
      className={cn('my-auto flex min-h-96 flex-col py-4', {
        'my-0': formattedActivityData.length > 0,
      })}
    >
      {formattedActivityData.length > 0 ? (
        formattedActivityData.map((items, index) => (
          <div key={index} className="pr-6">
            {/* TODO => FIX DATA TIMESTAMP */}
            <p className="text-lg text-[#161518]">{items.title}</p>

            {items?.data?.map((item, itemIndex) => (
              <div className="flex flex-col gap-y-4 py-2" key={itemIndex}>
                <div className="flex items-center space-x-4">
                  <LogTaskType type={item.type} />

                  <div className="w-full">
                    <div className="flex w-full justify-between">
                      <p className="mb-[4px] text-[14px] font-medium leading-6">
                        {item.created_by}
                      </p>
                      <div>
                        <Tooltip
                          placement="left"
                          classNames={{
                            content: cn(
                              'text-nowrap bg-secondary/10 text-secondary',
                              {
                                'bg-success/10 text-green-600':
                                  item?.isPrefunded,
                              },
                            ),
                          }}
                          content={capitalize(item?.status)}
                        >
                          <Chip
                            classNames={{
                              base: 'p-2 py-4 cursor-pointer',
                              content: cn(
                                'text-secondary text-base font-bold',
                                { 'text-green-500': item?.isPrefunded },
                              ),
                            }}
                            variant="light"
                            color={item?.isPrefunded ? 'success' : 'secondary'}
                          >
                            {formatCurrency(item?.amount)}
                          </Chip>
                        </Tooltip>
                        <p className="text-[12px] font-normal leading-4 text-slate-500">
                          {/* TODO => FIX DATA TIMESTAMP */}
                          {/* {formatDistance(new Date(item.created_at), new Date())} */}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <hr className="my-4 h-px border-0 bg-slate-100"></hr>
          </div>
        ))
      ) : (
        <div className="flex flex-1 items-center rounded-lg bg-slate-50 text-sm font-semibold text-slate-600">
          <EmptyLogs
            className={'my-auto'}
            title={'No Wallet Prefund Logs Recorded'}
            subTitle={
              'Make a deposit and submit a Proof of Payment (POP) to prefund your wallet'
            }
          />
        </div>
      )}
    </div>
  )
}

export function LogTaskType({ type }) {
  const taskType = TASK_TYPE[type]

  if (taskType) {
    return (
      <div
        className={cn(
          `inline-flex h-8 w-fit items-center justify-center gap-2 text-nowrap rounded-[4px] bg-${taskType.color}/50 px-2 py-1.5`,
        )}
      >
        <span className={cn(`text-${taskType.color}`)}>{taskType.icon}</span>
        <p
          className={cn(
            `text-[12px] font-medium leading-[16px] text-${taskType.color}`,
          )}
        >
          {taskType.label}
        </p>
      </div>
    )
  }
  return null
}

export default Wallet
