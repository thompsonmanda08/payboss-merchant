'use client'
import { FileDropZone } from '@/components/base'
import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import usePaymentsStore from '@/state/paymentsStore'
import Link from 'next/link'
import React from 'react'

const UploadCSVFile = ({ navigateForward }) => {
  const { paymentAction, updatePaymentFields } = usePaymentsStore()

  function handleProceed() {
    if (paymentAction?.file !== null) {
      navigateForward()
      return
    }
    notify('error', 'A valid file is required!')
  }

  return (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex flex-col">
          <FileDropZone
            onChange={(file) => {
              // console.log('ON CHANGE SHOW FILE NAME:', file.name)
              updatePaymentFields({ file })
            }}
          />

          <p className="mt-2 text-xs font-medium text-gray-500 lg:text-[13px]">
            Having trouble with the validation and file uploads?
            <Link
              href={'/batch_record_template.csv'}
              download={'batch_record_template.csv'}
              className="ml-1 font-bold text-primary"
            >
              Download a template here
            </Link>
          </p>
        </div>

        <div className="mt-4 flex h-1/6 w-full items-end justify-end gap-4">
          {/* <Button
            className={'font-medium text-primary'}
            variant="outline"
            onClick={navigateBackwards}
          >
            Back
          </Button> */}
          <Button onClick={handleProceed}>Next</Button>
        </div>
      </div>
    </>
  )
}

export default UploadCSVFile
