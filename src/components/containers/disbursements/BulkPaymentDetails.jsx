'use client'
import React, { useEffect } from 'react'
import usePaymentsStore from '@/context/paymentsStore'
import { Input } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { formatCurrency, notify } from '@/lib/utils'
import { BanknotesIcon, WalletIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'
import { PAYMENT_PROTOCOL } from '@/lib/constants'
import useDashboard from '@/hooks/useDashboard'
import { initializeBulkTransaction } from '@/app/_actions/transaction-actions'
import CustomRadioGroup from '@/components/ui/CustomRadioGroup'
import StatusMessage from '@/components/base/StatusMessage'

const PaymentDetails = ({
  navigateForward,
  navigateBackwards,
  workspaceID,
}) => {
  const {
    setLoading,
    loading,
    updatePaymentFields,
    setError,
    error,
    paymentAction,
    setBatchDetails,
    resetPaymentData,
    selectedProtocol,
    setSelectedProtocol,
    selectedActionType,
  } = usePaymentsStore()

  const { workspaceUserRole: role } = useDashboard()
  const urlParams = useSearchParams()
  const protocol = urlParams.get('protocol')

  async function handleProceed() {
    setLoading(true)

    if (!paymentAction?.protocol) {
      notify('error', 'Select a service protocol')
      setError({
        status: true,
        message: 'Select a service protocol (Direct or Voucher)',
      })
      return
    }

    if (
      paymentAction?.batch_name == '' &&
      paymentAction?.batch_name?.length < 3
    ) {
      setLoading(false)
      notify('error', 'A valid filename is required!')
      return
    }

    if (!role?.can_initiate) {
      notify('error', 'Unauthorized!')
      setError({
        status: true,
        message: 'You do not have permissions to perfom this action',
      })
      setLoading(false)
      return
    }

    // Create payment batch here if user is create access
    const response = await initializeBulkTransaction(workspaceID, paymentAction)

    if (response?.success) {
      notify('success', 'Payment Batch Created!')
      resetPaymentData()
      setBatchDetails(response?.data) // SET VALIDATION DATA INTO STATE
      navigateForward() // VALIDATION WILL HAPPEN ON THE NEXT SCREEN
      setLoading(false)
      return
    }

    notify('error', 'Failed to create payment batch!')
    setError({ status: true, message: response?.message })
    setLoading(false)
    return
  }

  function handleBackwardsNavigation() {
    // Set the file to null so that the user can upload again
    updatePaymentFields({ file: null })
    setError({ status: false, message: '' })
    navigateBackwards()
  }

  function handleProtocolSelection(option) {
    setSelectedProtocol(PAYMENT_PROTOCOL[option])
    updatePaymentFields({ protocol: PAYMENT_PROTOCOL[option] })
  }

  return (
    <div className="mx-auto flex w-full flex-1 flex-col gap-4 md:px-8">
      <div className="flex w-full flex-1 gap-4">
        {paymentAction?.prefund && (
          <div className="flex w-full items-center gap-3 rounded-md bg-primary/10 p-4 ">
            <WalletIcon className="h-6 w-6 text-primary" />
            <div className="h-8 border-r-2 border-primary/60" />
            <div className="flex w-full justify-between text-sm font-medium text-primary 2xl:text-base">
              <span className="font-bold uppercase">
                {paymentAction?.prefund?.name}
              </span>
              <span>
                {formatCurrency(paymentAction?.prefund?.available_balance)}
              </span>
            </div>
          </div>
        )}
        {selectedActionType?.name && (
          <div className="flex w-full items-center gap-3 rounded-md bg-primary/10 p-4 ">
            <selectedActionType.Icon className="h-6 w-6 text-primary" />
            <div className="h-8 border-r-2 border-primary/60" />
            <div className="flex w-full justify-between text-sm font-medium text-primary 2xl:text-base">
              <p>{selectedActionType?.name}</p>
            </div>
          </div>
        )}
        {selectedProtocol ? (
          <div className="flex w-full items-center gap-3 rounded-md bg-primary/10 py-3 pl-5 pr-4">
            <BanknotesIcon className="h-6 w-6 text-primary" />
            <div className="h-8 border-r-2 border-primary/60" />
            <div className="flex w-full justify-between text-sm font-medium capitalize text-primary 2xl:text-base">
              <p>{selectedProtocol}</p>
            </div>
          </div>
        ) : (
          <CustomRadioGroup
            onChange={(option) => handleProtocolSelection(option)}
            labelText="Service Protocol"
            defaultValue={protocol}
            options={PAYMENT_PROTOCOL?.map((item, index) => (
              <div key={index} className="flex flex-1 capitalize">
                <span className="font-medium">{item}</span>
              </div>
            ))}
          />
        )}
        <Input
          label={'Batch Name'}
          className="mb-auto w-full max-w-lg"
          containerClasses="w-full max-w-full"
          value={paymentAction?.batch_name}
          onChange={(e) => {
            updatePaymentFields({ batch_name: e.target.value })
          }}
        />
      </div>

      <div className="flex flex-1 items-end justify-end gap-4">
        <Button
          className={'bg-primary/10 font-medium text-primary'}
          color={'primary'}
          variant="light"
          onClick={handleBackwardsNavigation}
          isDisabled={loading}
        >
          Back
        </Button>
        <Button
          className={''}
          isDisabled={loading}
          isLoading={loading}
          onClick={handleProceed}
        >
          Validate Batch
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

export default PaymentDetails
