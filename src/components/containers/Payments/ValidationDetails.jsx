import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import usePaymentsStore from '@/state/paymentsStore'
import { Button } from '@/components/ui/Button'
import { Modal, Spinner, StatusCard } from '@/components/base'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import InvalidRecords from '../Tables/InvalidRecords'
import AllRecords from '../Tables/AllRecords'
import ValidRecords from '../Tables/ValidRecords'

const ValidationDetails = ({
  changeScreen,
  updatePaymentFields,
  paymentAction,
}) => {
  const queryClient = useQueryClient()
  const { loading, setLoading } = usePaymentsStore()
  const [openAll, setOpenAll] = useState(false)
  const [openValid, setOpenValid] = useState(false)
  const [openInvalid, setOpenInvalid] = useState(false)

  const date = new Date()
  const aDayPlus = new Date(date)
  aDayPlus.setDate(date.getDate() + 1)

  const nextDay = aDayPlus.toISOString().split('T')[0]
  const currentDate = date.toISOString().split('T')[0]

  if (loading) {
    // TODO: REMOVE AFTER SERVER CONNECTION
    setTimeout(() => {
      setLoading(false)
    }, 2000)
    return (
      <div className="grid flex-1 flex-grow place-items-center py-8">
        <div className="flex w-fit flex-col items-center justify-center gap-4">
          <Spinner size={50} />
        </div>
      </div>
    )
  }

  const closeModal = () => {
    setOpenAll(false)
    setOpenValid(false)
    setOpenInvalid(false)
  }

  const openModal = (type) => {
    if (type === 'all') {
      setOpenAll(true)
    } else if (type === 'valid') {
      setOpenValid(true)
    } else if (type === 'invalid') {
      setOpenInvalid(true)
    }
  }

  return (
    <>
      <div className="flex h-full w-full flex-col justify-between ">
        <StatusCard
          totalTitle={'Total Records'}
          totalText={'2,120'}
          totalInfo={'View All Records'}
          validTitle={'Valid Records'}
          validText={'2,000'}
          validInfo={'View Valid Records'}
          invalidTitle={'Invalid Records'}
          invalidText={'120'}
          invalidInfo={'View Invalid Records'}
          tooltipText={'All records must be valid to proceed'}
          Icon={QuestionMarkCircleIcon}
          IconColor="#ffb100"
          viewAllRecords={() => openModal('all')}
          viewValidRecords={() => openModal('valid')}
          viewInvalidRecords={() => openModal('invalid')}
        />

        <div className="mt-8 flex h-1/6 w-full items-end justify-end gap-4">
          <Button
            className={'font-medium text-primary'}
            variant="outline"
            onClick={() => {
              changeScreen(2)
            }}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              // changeScreen(4) // --> SERVER
            }}
          >
            Submit For Approval
          </Button>
        </div>
      </div>
      <Modal
        show={openInvalid || openValid || openAll}
        onClose={closeModal}
        onConfirm={openModal}
        title={
          openAll
            ? 'All Records'
            : openValid
              ? 'Valid Records'
              : 'Invalid Records'
        }
        infoText={
          openAll
            ? 'This list includes all the records that have been processed. Review them carefully.'
            : openValid
              ? 'All records in this list are valid and ready for the next step.'
              : 'The records listed here contain errors or missing information. Please update them to proceed with the transaction.'
        }
        width={1500}
      >
        {openAll && <AllRecords />}
        {openValid && <ValidRecords />}
        {openInvalid && <InvalidRecords />}
      </Modal>
    </>
  )
}

export default ValidationDetails
