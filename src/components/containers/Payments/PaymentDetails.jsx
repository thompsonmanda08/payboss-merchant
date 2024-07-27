import React, { act } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import usePaymentsStore from '@/context/paymentsStore'
import { Input } from '@/components/ui/input'
import { PAYMENT_TYPES } from './BulkPaymentAction'
import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import { SelectField } from '@/components/base'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'

const PaymentDetails = ({ navigateForward, navigateBackwards }) => {
  const { setLoading, updatePaymentFields, paymentAction } = usePaymentsStore()

  const urlParams = useSearchParams()
  const service = urlParams.get('service')

  const selectedActionType = PAYMENT_TYPES[0]

  function handleProceed() {
    if (
      paymentAction?.batchName !== '' &&
      paymentAction?.batchName !== (null || undefined) &&
      paymentAction?.batchName?.length > 3
    ) {
      setLoading(true)
      navigateForward()
      return
    }
    notify('error', 'A valid filename is required!')
  }

  function handleBackwardsNavigation() {
    updatePaymentFields({ file: null })
    navigateBackwards()
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-4">
      <div className="flex w-full items-center gap-3 rounded-md bg-primary/20 p-2">
        <selectedActionType.Icon className="h-5 w-5 text-primary" />
        <div className="h-6 border-r-2 border-primary/60" />
        <div className="flex w-full justify-between text-sm font-medium text-primary 2xl:text-base">
          <p>{selectedActionType?.name}</p>
        </div>
      </div>
      <div className="flex w-full items-center gap-3 rounded-md bg-primary/20 p-2">
        <BanknotesIcon className="h-5 w-5 text-primary" />
        <div className="h-6 border-r-2 border-primary/60" />
        <div className="flex w-full justify-between text-sm font-medium capitalize text-primary 2xl:text-base">
          <p>{service}</p>
        </div>
      </div>
      {/* <SelectField
        name={'paymentAction'}
        label={'Payment Action'}
        options={[1, 2, 3, 4, 5]}
      /> */}

      <Input
        label={'Batch Name'}
        value={paymentAction?.batchName}
        onChange={(e) => {
          updatePaymentFields({ batchName: e.target.value })
        }}
      />
      <div className="mt-4 flex h-1/6 w-full items-end justify-end gap-4">
        <Button
          className={'font-medium text-primary'}
          variant="outline"
          onClick={handleBackwardsNavigation}
        >
          Back
        </Button>
        <Button onClick={handleProceed}>Validate Batch</Button>
      </div>
    </div>
  )
}

export default PaymentDetails
