'use client'
import React, { useEffect, useState } from 'react'
import usePaymentsStore from '@/context/paymentsStore'
import { Input } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import { BanknotesIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'
import { PAYMENT_SERVICE, PAYMENT_SERVICE_TYPES } from '@/lib/constants'
import useDashboard from '@/hooks/useDashboard'
import useWorkspaces from '@/hooks/useWorkspaces'
import { initializeBulkTransaction } from '@/app/_actions/transaction-actions'
import { StatusMessage } from '@/components/base'
import CustomRadioGroup from '@/components/ui/CustomRadioGroup'

const PaymentDetails = ({ navigateForward, navigateBackwards }) => {
  const {
    setLoading,
    loading,
    updatePaymentFields,
    setError,
    error,
    paymentAction,
    setBatchDetails,
  } = usePaymentsStore()
  const { workspaceUserRole } = useDashboard()
  const { workspaceID } = useWorkspaces()

  const urlParams = useSearchParams()
  const service = urlParams.get('service')

  const { selectedService, setSelectedService, selectedActionType } =
    usePaymentsStore()

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

    // Check if the selected service is not available yet
    if (selectedService.toLowerCase() == 'voucher') {
      setLoading(false)
      notify('error', 'Service Not available yet!')
      return
    }

    // Create payment batch here if user is create access
    if (workspaceUserRole?.create) {
      const response = await initializeBulkTransaction(
        workspaceID,
        paymentAction,
      )

      if (response.success) {
        notify('success', 'Payment Batch Created!')
        setBatchDetails(response.data) // SET VALIDATION DATA INTO STATE
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
    setError({ status: false, message: '' })
    navigateBackwards()
  }

  useEffect(() => {
    setError({ status: false, message: '' })
    setLoading(false)
  }, [paymentAction])

  function selectServiceType(option) {
    setSelectedService(PAYMENT_SERVICE[option])
    updatePaymentFields({ type: PAYMENT_SERVICE[option] })
  }

  // console.log(selectedService)

  return (
    <div className="flex h-full w-full flex-col  gap-4">
      <div className="flex w-full items-center gap-3 rounded-md bg-primary/10 p-4 ">
        <selectedActionType.Icon className="h-6 w-6 text-primary" />
        <div className="h-8 border-r-2 border-primary/60" />
        <div className="flex w-full justify-between text-sm font-medium text-primary 2xl:text-base">
          <p>{selectedActionType?.name}</p>
        </div>
      </div>
      {selectedService ? (
        <div className="flex w-full items-center gap-3 rounded-md bg-primary/10 py-3 pl-5 pr-4">
          <BanknotesIcon className="h-6 w-6 text-primary" />
          <div className="h-8 border-r-2 border-primary/60" />
          <div className="flex w-full justify-between text-sm font-medium capitalize text-primary 2xl:text-base">
            <p>{selectedService}</p>
          </div>
          <Button
            variant="light"
            className={''}
            onPress={() => setSelectedService(null)}
          >
            <PencilSquareIcon className="h-4 w-4" />
            Change
          </Button>
        </div>
      ) : (
        <CustomRadioGroup
          onChange={(option) => selectServiceType(option)}
          labelText="Service"
          defaultValue={service}
          options={
            // MUST BE AN ARRAY
            PAYMENT_SERVICE?.map((item, index) => (
              <div key={index} className="flex flex-1 capitalize">
                <span className="font-medium">{item}</span>
              </div>
            ))
          }
        />
      )}

      <div className="flex items-end gap-4">
        <Input
          label={'Batch Name'}
          className="w-full max-w-full"
          containerClasses="w-full max-w-full"
          value={paymentAction?.batch_name}
          onChange={(e) => {
            updatePaymentFields({ batch_name: e.target.value })
          }}
        />
        <Button
          className={'w-full max-w-xs'}
          isDisabled={loading}
          isLoading={loading}
          onClick={handleProceed}
        >
          Validate Batch
        </Button>

        <Button
          className={'bg-primary/10 font-medium text-primary'}
          color={'primary'}
          variant="light"
          onClick={handleBackwardsNavigation}
          isDisabled={loading}
        >
          Go Back
        </Button>
      </div>

      {error?.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}
    </div>
  )
}

{
  /* <Button
          className={'font-medium text-primary'}
          variant="outline"
          onClick={handleBackwardsNavigation}
          isDisabled={loading}
        >
          Back
        </Button> */
}

export default PaymentDetails
