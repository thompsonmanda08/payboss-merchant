'use client'
import { FileDropZone } from '@/components/base'
import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import usePaymentsStore from '@/context/paymentsStore'
import Link from 'next/link'
import React from 'react'
import { uploadPaymentBatchFile } from '@/app/_actions/pocketbase-actions'
import useAccountProfile from '@/hooks/useProfileDetails'

const UploadCSVFile = ({ navigateForward }) => {
  const { paymentAction, updatePaymentFields } = usePaymentsStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const { merchantID } = useAccountProfile()

  function handleProceed() {
    if (paymentAction?.url !== '') {
      navigateForward()
      return
    }
    notify('error', 'A valid file is required!')
  }

  async function handleFileUpload(file, recordID) {
    setIsLoading(true)

    let response = await uploadPaymentBatchFile(file, merchantID, recordID)

    if (response.success) {
      notify('success', 'File Added!')
      updatePaymentFields({
        url: response?.data?.file_url,
        recordID: response?.data?.file_record_id,
      })
      setIsLoading(false)
      return response?.data
    }

    notify('error', 'Failed to add file')
    notify('error', response.message)
    setIsLoading(false)
    return {}
  }

  return (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex flex-col">
          <FileDropZone
            otherAcceptedFiles={{
              'application/vnd.ms-excel': [],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                [],
            }}
            onChange={async (file) =>
              await handleFileUpload(file, paymentAction?.recordID)
            }
          />

          <p className="mt-2 text-xs font-medium text-gray-500 lg:text-[13px]">
            Having trouble with the validation and file uploads?
            <Link
              href={'/batch_record_template.xlsx'}
              download={'batch_record_template.xlsx'}
              className="ml-1 font-bold text-primary"
            >
              Download a template here
            </Link>
          </p>
        </div>

        <div className="flex h-1/6 w-full items-end justify-end gap-4">
          <Button onClick={handleProceed}>Next</Button>
        </div>
      </div>
    </>
  )
}

export default UploadCSVFile
