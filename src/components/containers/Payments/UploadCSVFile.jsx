'use client'
import React from 'react'

const UploadCSVFile = ({
  paymentAction,
  changeScreen,
  updatePaymentFields,
}) => {
  return (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex h-5/6 w-full flex-col items-center justify-center gap-4 text-center">
          <div
            className="bg-primary-50/50 hover:bg-primary-50/60 ring-primary-100 flex h-12 w-full shrink-0 cursor-pointer items-center 
          rounded-md text-sm tracking-tighter ring-offset-1 focus-within:ring-2 lg:text-base"
          ></div>
          <div className="max-h-[250px] min-h-[250px] w-full overflow-y-auto">
            {/*  */}
            <></>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadCSVFile
