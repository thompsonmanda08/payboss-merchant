'use client'
import React, { useEffect } from 'react'
import usePaymentsStore from '@/context/paymentsStore'
import { Input } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { notify } from '@/lib/utils'
import { BanknotesIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'
import { PAYMENT_PROTOCOL } from '@/lib/constants'
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
  const protocol = urlParams.get('protocol')

  const { setSelectedProtocol } = usePaymentsStore()

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

    // Create payment batch here if user is create access
    if (workspaceUserRole?.create || workspaceUserRole?.can_initiate) {
      /*  */
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

  useEffect(() => {
    if (protocol) {
      setSelectedProtocol(protocol)
      updatePaymentFields({ protocol })
    } else {
      setSelectedProtocol(null)
    }
  }, [protocol])

  return (
    <div className="flex h-full w-full flex-col  gap-4">
      <ServiceConfig protocol={protocol} />

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

export function ServiceConfig({ protocol }) {
  const {
    selectedProtocol,
    setSelectedProtocol,
    selectedActionType,
    updatePaymentFields,
  } = usePaymentsStore()

  function handleProtocolSelection(option) {
    setSelectedProtocol(PAYMENT_PROTOCOL[option])
    updatePaymentFields({ protocol: PAYMENT_PROTOCOL[option] })
  }
  return (
    <>
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
          <Button
            variant="light"
            className={''}
            onPress={() => setSelectedProtocol(null)}
          >
            <PencilSquareIcon className="h-4 w-4" />
            Change
          </Button>
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
    </>
  )
}

export default PaymentDetails
