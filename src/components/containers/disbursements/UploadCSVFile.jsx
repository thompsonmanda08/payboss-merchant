'use client'

import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import usePaymentsStore from '@/context/paymentsStore'
import Link from 'next/link'
import React from 'react'
import { uploadPaymentBatchFile } from '@/app/_actions/pocketbase-actions'
import useAccountProfile from '@/hooks/useProfileDetails'
import { SingleFileDropzone } from '@/components/base/FileDropZone'

const UploadCSVFile = ({ navigateForward, navigateBackwards }) => {
  const { paymentAction, updatePaymentFields, selectedProtocol } =
    usePaymentsStore()
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

    if (response?.success) {
      notify('success', 'File Added!')
      updatePaymentFields({
        url: response?.data?.file_url,
        recordID: response?.data?.file_record_id,
      })
      setIsLoading(false)
      return response?.data
    }

    notify('error', 'Failed to add file')
    setIsLoading(false)
    return {}
  }

  return (
    <>
      <div className="flex h-full w-full flex-col gap-5">
        <div className="flex flex-col">
          <SingleFileDropzone
            isLoading={isLoading}
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
            Having trouble with the validation and file uploads? Download
            {selectedProtocol == 'direct' ? (
              <Link
                href={'/batch_record_template.xlsx'}
                download={'batch_record_template.xlsx'}
                className="ml-1 font-bold text-primary hover:underline hover:underline-offset-2"
              >
                Direct Transfer{' '}
              </Link>
            ) : (
              <Link
                href={'/batch_record_template_voucher.xlsx'}
                download={'batch_record_template_voucher.xlsx'}
                className="ml-1 font-bold text-primary"
              >
                Voucher Transfer{' '}
              </Link>
            )}
            template here
          </p>
        </div>
        <div>
          <ul className="list-disc rounded-lg bg-primary-50 p-2 px-10 text-sm text-slate-600">
            <li>
              Download the provided template to ensure your XLSX file is in the
              correct format.
            </li>
            <li>
              Upload the completed XLSX file with the correct data format.
            </li>
            <li>Enter a batch name to label the batch process.</li>
            <li>
              Review and validate the uploaded file; address any errors found
              during validation.
            </li>
            <li>
              If you have the necessary permissions, approve the batch process
              to proceed.
            </li>
          </ul>
        </div>

        <div className="mt-auto flex w-full items-end justify-end gap-4">
          <Button
            className={'bg-primary/10 font-medium text-primary'}
            color={'primary'}
            variant="light"
            onClick={navigateBackwards}
            isDisabled={isLoading}
          >
            Back
          </Button>
          <Button
            size="lg"
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={handleProceed}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}

export default UploadCSVFile
