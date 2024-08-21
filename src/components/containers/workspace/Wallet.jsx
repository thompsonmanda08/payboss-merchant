import { Balance, Card, CardHeader, StatusMessage } from '@/components/base'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/InputField'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useEffect } from 'react'
import { UploadField } from '../account-verification/DocumentAttachments'
import { cn, notify } from '@/lib/utils'
import { sampleActivityLogs } from './ActivityLog'
import { TASK_ICON_BG_COLOR_MAP, TASK_TYPE } from '@/lib/constants'
import { formatActivityData } from '@/lib/utils'
import { formatDistance } from 'date-fns'
import PromptModal from '@/components/base/Prompt'
import { useDisclosure } from '@nextui-org/react'
import { uploadPOPDocument } from '@/app/_actions/pocketbase-actions'

const activityLogStore = {
  activityLogs: sampleActivityLogs,
}

const POP_INIT = {
  amount: 0,
  refNo: '',
  file: null,
}

function Wallet() {
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
    !formData?.amount ||
    formData?.amount < 0 ||
    !formData?.refNo ||
    !formData?.file?.file_url ||
    isLoading

  async function handleFileUpload(file, recordID) {
    setError({ message: '', status: '' })

    let response = await uploadPOPDocument(file, recordID)
    if (response.success) {
      notify('success', response?.message)
      return response?.data
    }

    notify('error', response.message)
    return null
  }

  async function handleWalletPreFund() {
    setIsLoading(true)

    if (!formData.file?.file_url) {
      notify('error', 'Attach proof of payment!')
      setError({
        message: 'Verify that you have attached a proof of payment!',
        status: true,
      })
      setIsLoading(false)
      onClose()
      return
    }

    setTimeout(() => {
      console.log(formData)
      notify('success', 'Completed successfully!')
      setIsLoading(false)
      setFormData(POP_INIT)
      onClose()
    }, 3000)
    // TODO: send request to pre-fund wallet
  }

  return (
    <>
      <section role="wallet-section" className="">
        <Card className="container flex w-full flex-col items-start justify-center gap-8 md:flex-row">
          <div className="flex w-full max-w-md flex-1 flex-col gap-4">
            <Balance title={'PayBoss Wallet'} amount={'K10, 500'} isLandscape />
            <div
              className={cn(
                'flex w-full flex-col gap-y-4 p-[25px] lg:border lg:border-y-0 lg:border-l-0 lg:border-border',
              )}
            >
              <div role="pre-fund-wallet" className="flex  flex-col gap-4">
                <p className="text-[14px] font-semibold text-slate-800">
                  Deposit funds into your PayBoss Wallet
                </p>
                <Input
                  type="number"
                  label="Amount"
                  value={formData.amount}
                  placeholder="Amount"
                  onChange={(e) => updateFormData({ amount: e.target.value })}
                  name="amount"
                />
                <Input
                  placeholder="Receipt No: "
                  label="Reference Number"
                  value={formData.refNo}
                  onChange={(e) => updateFormData({ refNo: e.target.value })}
                  name="refNo"
                />
                {error.status && (
                  <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
                    <StatusMessage
                      error={error.status}
                      message={error.message}
                    />
                  </div>
                )}
                <UploadField
                  label="Proof of Payment"
                  handleFile={async (file) => {
                    const file_record = await handleFileUpload(
                      file,
                      formData.file?.file_record_id,
                    )
                    updateFormData({ file: file_record })
                  }}
                  acceptedFiles={{
                    'application/pdf': [],
                    'image/png': [],
                    'image/jpeg': [],
                    'image/jpg': [],
                  }}
                />

                <Button isDisabled={isDisabled} type="button" onClick={onOpen}>
                  Pre-Fund Wallet
                </Button>
              </div>
            </div>
          </div>
          <ScrollArea className="flex h-full max-h-[600px] flex-[2] flex-grow flex-col items-start gap-8 ">
            <CardHeader title="Wallet Transaction History" />
            <PreFundHistory />
          </ScrollArea>
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
          <p className="leading-2 m-0">
            <strong>Are you sure you want to perform this action?</strong>
          </p>
          <p className="text-sm text-slate-700">
            Your wallet will be credited with
            <code className="mx-1 rounded-md bg-primary/10 p-1 px-2 font-bold text-primary-700">
              ZMW {formData?.amount}
            </code>
            as soon as your transaction is verified, This will take a few
            minutes.
          </p>
        </PromptModal>
      </section>
    </>
  )
}

function renderTaskType(taskName) {
  const taskType = TASK_TYPE[taskName]

  if (taskType) {
    return (
      <div
        className={`inline-flex h-8 w-fit items-center justify-center gap-2 text-nowrap rounded-[4px] bg-green-500/20 px-2 py-1.5`}
      >
        <span className={`text-green-600`}>{taskType.icon}</span>
        <p className={`text-[12px] font-medium leading-[16px] text-green-700`}>
          {taskType.label}
        </p>
      </div>
    )
  }
  return null
}

function PreFundHistory() {
  const formattedActivityData = formatActivityData(
    activityLogStore.activityLogs,
  )

  return (
    <div className="flex flex-col py-4">
      {formattedActivityData.length > 0 ? (
        formattedActivityData.map((items, index) => (
          <div key={index} className="pr-6">
            <p className="text-lg text-[#161518]">{items.title}</p>

            {items.data.map((item, itemIndex) => (
              <div className="flex flex-col gap-y-4 py-2" key={itemIndex}>
                <div className="flex items-center space-x-4">
                  {renderTaskType(item.type)}

                  <div className="w-full">
                    <div className="flex w-full justify-between">
                      <p className="mb-[4px] text-[14px] font-medium leading-6">
                        {item.created_by.user_name}
                      </p>
                      <p className="leading-4] text-[12px] font-normal text-[#898989]">
                        {formatDistance(new Date(item.createdAt), new Date())}
                      </p>
                    </div>
                    <p className="text-[12px] text-[#656971]">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: item.content,
                        }}
                      ></p>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <hr className="my-4 h-px border-0 bg-[#ECEDF0]"></hr>
          </div>
        ))
      ) : (
        <div className="grid min-h-[200px] place-items-center rounded-lg bg-slate-50 text-sm font-semibold text-slate-500 xl:text-base">
          No deposit logs recorded
        </div>
      )}
    </div>
  )
}

export default Wallet
