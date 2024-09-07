'use client'
import React, { useEffect } from 'react'
import usePaymentsStore from '@/context/paymentsStore'
import { Input } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import {
  formatNRCNumber,
  isValidNRCNo,
  isValidZambianMobileNumber,
  notify,
} from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { slideDownInView } from '@/lib/constants'
import useDashboard from '@/hooks/useDashboard'
import useWorkspaces from '@/hooks/useWorkspaces'
import { initializeSingleTransaction } from '@/app/_actions/transaction-actions'
import { Card, CardHeader, StatusMessage } from '@/components/base'
import SelectField from '@/components/ui/SelectField'
import { AnimatePresence, motion } from 'framer-motion'
import { ServiceConfig } from './BulkPaymentDetails'

const SinglePaymentDetails = ({ navigateForward }) => {
  const {
    setLoading,
    loading,
    setError,
    error,
    paymentAction,
    updatePaymentFields,
    setTransactionDetails,
  } = usePaymentsStore()
  const { workspaceUserRole } = useDashboard()
  const { workspaceID } = useWorkspaces()

  const phoneNoError =
    !isValidZambianMobileNumber(paymentAction?.contact) &&
    paymentAction?.contact?.length > 5

  const nrcError =
    !isValidNRCNo(paymentAction?.nrc) && paymentAction?.nrc?.length > 10

  const urlParams = useSearchParams()
  const protocol = urlParams.get('protocol')

  const { selectedProtocol, setSelectedProtocol } = usePaymentsStore()

  async function handleProceed(e) {
    e?.preventDefault()
    setLoading(true)

    // *********************** FORM VALIDATION ************************ //

    if (!paymentAction?.protocol) {
      notify('error', 'Select a service protocol')
      setError({
        status: true,
        message: 'Select a service protocol (Direct or Voucher)',
      })
      return
    }

    if (
      paymentAction?.first_name?.length < 3 ||
      paymentAction?.last_name?.length < 3
    ) {
      setLoading(false)
      notify('error', 'A valid filename is required!')
      setError({
        // status: true,
        message: 'Please enter a valid field name',
        onName: true,
      })
      return
    }

    if (!isValidNRCNo(paymentAction?.nrc)) {
      notify('error', 'Enter a Valid NRC Number')
      setLoading(false)
      setError({
        onNRC: true,
      })

      return
    }

    if (!isValidZambianMobileNumber(paymentAction?.contact)) {
      setLoading(false)
      notify('error', 'Provide a valid Mobile Number!')
      setError({
        // status: true,
        message: 'Please enter a valid Mobile Number!',
        onMobileNumber: true,
      })
      return
    }

    // *********************** END FORM VALIDATION ******************** //

    // Create payment batch here if user is create access
    if (workspaceUserRole?.create || workspaceUserRole?.can_initiate) {
      /*  */
      const response = await initializeSingleTransaction(
        workspaceID,
        paymentAction,
      )

      if (response.success) {
        notify('success', 'Payment Request Created!')
        setTransactionDetails(response.data) // SET VALIDATION DATA INTO STATE
        navigateForward() // VALIDATION WILL HAPPEN ON THE NEXT SCREEN
        setLoading(false)
        return
      }

      notify('error', 'Failed to create payment request!')
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

      <Card className={'mx-auto max-w-xl shadow-none'}>
        <CardHeader
          title={'Recipient Details'}
          infoText={
            'Valid information that the recipient needs to provide to claim the payment'
          }
        />
        <form onSubmit={handleProceed} className="mt-2 flex flex-col gap-2">
          <div className=" flex flex-col gap-4 sm:flex-row">
            <Input
              autoFocus
              label="First Name"
              value={paymentAction?.first_name}
              onError={error?.onName}
              required={true}
              onChange={(e) => {
                updatePaymentFields({ first_name: e.target.value })
              }}
            />
            <Input
              label="Last Name"
              value={paymentAction?.last_name}
              required={true}
              onError={error?.onName}
              onChange={(e) => {
                updatePaymentFields({ last_name: e.target.value })
              }}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            containerClasses={'max-w-full'}
            value={paymentAction?.email}
            required={true}
            onChange={(e) => {
              updatePaymentFields({ email: e.target.value })
            }}
          />
          <div className=" flex flex-col gap-4 sm:flex-row">
            <Input
              label="Mobile Number"
              type="tel"
              value={paymentAction?.contact}
              onError={error?.onMobileNumber || phoneNoError}
              errorText={'Invalid Mobile Number'}
              required={true}
              onChange={(e) => {
                updatePaymentFields({ contact: e.target.value })
              }}
            />
            <Input
              label="NRC No."
              value={paymentAction?.nrc}
              onError={error?.onNRC || nrcError}
              errorText={'Invalid NRC Number'}
              required={true}
              onChange={(e) => {
                updatePaymentFields({ nrc: formatNRCNumber(e.target.value) })
              }}
            />
          </div>
          <Input
            label="Amount"
            type="number"
            containerClasses={'max-w-full'}
            value={paymentAction?.amount}
            required={true}
            onChange={(e) => {
              updatePaymentFields({ amount: e.target.value?.toString() })
            }}
          />
          {selectedProtocol == 'direct' && (
            <AnimatePresence mode="wait">
              <motion.div
                variants={slideDownInView}
                initial={'hidden'}
                animate={'visible'}
                exit={'hidden'}
                className=" flex flex-col gap-4 sm:flex-row"
              >
                <SelectField
                  label="Account Type"
                  value={paymentAction?.accountType}
                  options={['Mobile', 'Bank']}
                  required={true}
                  onChange={(e) => {
                    updatePaymentFields({
                      accountType: e.target.value.toString().toLowerCase(),
                    })
                  }}
                />

                <Input
                  label="Destination Account Number"
                  type="number"
                  value={paymentAction?.destination}
                  required={true}
                  onChange={(e) => {
                    updatePaymentFields({ destination: e.target.value })
                  }}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {error?.status && (
            <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 capitalize">
              <StatusMessage error={error.status} message={error.message} />
            </div>
          )}
          <Button
            type="submit"
            size="lg"
            className={'mt-4 w-full'}
            isDisabled={loading}
            isLoading={loading}
            // onClick={handleProceed}
          >
            Proceed
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default SinglePaymentDetails
