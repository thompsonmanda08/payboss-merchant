'use client'
import React, { useEffect } from 'react'
import usePaymentsStore from '@/context/paymentsStore'
import { Input } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'
import useDashboard from '@/hooks/useDashboard'
import useWorkspaces from '@/hooks/useWorkspaces'
import { initializeBulkTransaction } from '@/app/_actions/transaction-actions'
import { StatusMessage } from '@/components/base'

const PaymentDetails = ({ navigateForward, navigateBackwards }) => {
  const {
    setLoading,
    loading,
    updatePaymentFields,
    setError,
    error,
    paymentAction,
  } = usePaymentsStore()
  const { workspaceUserRole } = useDashboard()
  const { workspaceID } = useWorkspaces()

  const urlParams = useSearchParams()
  const service = urlParams.get('service')

  const selectedActionType = PAYMENT_SERVICE_TYPES[0]

  async function handleProceed() {
    setLoading(true)
    if (
      paymentAction?.batch_name == '' &&
      paymentAction?.batch_name?.length < 3
    ) {
      setLoading(false)
      notify('error', 'A valid filename is required!')
      return
    }

    // Create payment batch here if user is create access
    if (workspaceUserRole.create) {
      const response = await initializeBulkTransaction(
        workspaceID,
        paymentAction,
      )

      if (response.success) {
        notify('success', 'Payment Batch Created!')
        navigateForward() // VALIDATION WILL HAPPEN ON THE NEXT SCREEN
        setLoading(false)
        return
      }

      notify('error', 'Failed to create payment batch!')
      setError({ status: true, message: response.message })
      notify('error', response.message)
      setLoading(false)
      return
    }

    // If the user cannot create then they are unauthorized
    setLoading(false)
    notify('error', 'Unauthorized!')
    return
  }

  function handleBackwardsNavigation() {
    // Set the file to null so that the user can upload again
    updatePaymentFields({ file: null })
    navigateBackwards()
  }

  useEffect(() => {
    setError({ status: false, message: '' })
  }, [paymentAction, navigateBackwards])

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

      <Input
        label={'Batch Name'}
        value={paymentAction?.batch_name}
        onChange={(e) => {
          updatePaymentFields({ batch_name: e.target.value })
        }}
      />
      {error?.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}
      <div className="mt-4 flex h-1/6 w-full items-end justify-end gap-4">
        <Button
          className={'font-medium text-primary'}
          variant="outline"
          onClick={handleBackwardsNavigation}
          isDisabled={loading}
        >
          Back
        </Button>
        <Button
          isDisabled={loading}
          isLoading={loading}
          onClick={handleProceed}
        >
          Validate Batch
        </Button>
      </div>
    </div>
  )
}

export default PaymentDetails
