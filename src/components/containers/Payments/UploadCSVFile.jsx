'use client'
import { FileDropZone } from '@/components/base'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import React from 'react'

const UploadCSVFile = ({
  paymentAction,
  changeScreen,
  updatePaymentFields,
}) => {
  return (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <FileDropZone
          onChange={(file) => {
            // console.log('ON CHANGE SHOW FILE NAME:', file.name)
            updatePaymentFields({ file })
          }}
        />

        <p className="mt-2 text-xs font-medium text-gray-500 lg:text-[13px]">
          Having trouble with the file uploads?
          <Link
            href={'#'}
            download={'#'}
            className="ml-1 font-bold text-primary"
          >
            Download a template here
          </Link>
        </p>

        <div className="mt-4 flex h-1/6 w-full items-end justify-end">
          <Button onClick={() => changeScreen(2)}>Next</Button>
        </div>
      </div>
    </>
  )
}

export default UploadCSVFile
