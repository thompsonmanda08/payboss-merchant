import React from 'react'

import { useQueryClient } from '@tanstack/react-query'
import usePaymentsStore from '@/state/paymentsStore'

const BatchPaymentDetails = ({
  changeScreen,
  updatePaymentFields,
  paymentAction,
}) => {
  const queryClient = useQueryClient()
  const { loading } = usePaymentsStore()

  const date = new Date()
  const aDayPlus = new Date(date)
  aDayPlus.setDate(date.getDate() + 1)

  const nextDay = aDayPlus.toISOString().split('T')[0]
  const currentDate = date.toISOString().split('T')[0]

  return loading ? (
    <>
      {loading && (
        <div className="grid flex-1 flex-grow place-items-center py-8">
          <div className="flex w-fit flex-col items-center justify-center gap-4">
            <Spinner size={48} />
            <p className="text-sm text-slate-700">Please wait...</p>
          </div>
        </div>
      )}
    </>
  ) : (
    <>
      <div className="flex h-full w-full flex-col justify-between ">
        <div className="flex h-5/6 w-full flex-col items-center justify-center gap-3 text-center ">
          {/*  */}
          FILE VALIDATED - SHOW RECORDS
        </div>
      </div>
    </>
  )
}

export default BatchPaymentDetails
