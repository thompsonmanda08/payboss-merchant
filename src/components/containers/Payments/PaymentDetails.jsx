import React, { act } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import usePaymentsStore from '@/state/paymentsStore'
import { Input } from '@/components/ui/input'
import { PAYMENT_TYPES } from '.'
import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import { SelectField } from '@/components/base'
import { BanknotesIcon } from '@heroicons/react/24/outline'

const PaymentDetails = ({
  changeScreen,
  updatePaymentFields,
  paymentAction,
  navigateForward,
  navigateBackwards,
}) => {
  const queryClient = useQueryClient()
  const { loading, setLoading } = usePaymentsStore()

  const date = new Date()
  const aDayPlus = new Date(date)
  aDayPlus.setDate(date.getDate() + 1)

  const nextDay = aDayPlus.toISOString().split('T')[0]
  const currentDate = date.toISOString().split('T')[0]

  const selectedActionType = PAYMENT_TYPES.find(
    (type) => type.name === paymentAction.type,
  )

  function handleProceed() {
    if (
      paymentAction?.batchName !== '' &&
      paymentAction?.batchName !== (null || undefined) &&
      paymentAction?.batchName?.length > 3
    ) {
      navigateForward()
      setLoading(true)
      return
    }
    notify('error', 'A valid filename is required!')
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-4">
      <div className="flex w-full items-center gap-3 rounded-md bg-primary/20 p-2">
        <selectedActionType.Icon className="h-5 w-5 text-primary" />
        <div className="h-6 border-r-2 border-primary/60" />
        <div className="flex w-full justify-between text-sm font-medium text-primary 2xl:text-base">
          <div>{selectedActionType?.name}</div>
          {/* <button className="text-xs">Change</button> */}
        </div>
      </div>
      <div className="flex w-full items-center gap-3 rounded-md bg-primary/20 p-2">
        <BanknotesIcon className="h-5 w-5 text-primary" />
        <div className="h-6 border-r-2 border-primary/60" />
        <div className="flex w-full justify-between text-sm font-medium text-primary 2xl:text-base">
          <div>{paymentAction?.serviceAction}</div>
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
          onClick={navigateBackwards}
        >
          Back
        </Button>
        <Button onClick={handleProceed}>Validate Batch</Button>
      </div>
    </div>
  )
}

export default PaymentDetails
