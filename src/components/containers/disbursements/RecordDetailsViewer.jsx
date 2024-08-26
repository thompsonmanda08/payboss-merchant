'use client'
import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@nextui-org/modal'
import AllRecords from '../tables/AllRecords'
import ValidRecords from '../tables/ValidRecords'
import InvalidRecords from '../tables/InvalidRecords'
import usePaymentsStore from '@/context/paymentsStore'
import { useQueryClient } from '@tanstack/react-query'
import { useBatchDetails } from '@/hooks/useQueryHooks'
import { BATCH_DETAILS_QUERY_KEY } from '@/lib/constants'
import { CardHeader } from '@/components/base'

function RecordDetailsViewer({ batchID }) {
  const queryClient = useQueryClient()
  const {
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    closeRecordsModal,
    batchDetails: batchState,
    setBatchDetails,
  } = usePaymentsStore()

  const { data: batch } = useBatchDetails(batchState?.ID || batchID)
  const batchDetails = batch?.data


  // Determine which modal view to open
  const openModalView =
    (openInvalidRecordsModal && batchDetails?.invalid?.length) ||
    openValidRecordsModal ||
    openAllRecordsModal

  const title = openInvalidRecordsModal
    ? 'Invalid Records'
    : openValidRecordsModal
      ? 'Valid Records'
      : 'All Records'

  const infoText = openAllRecordsModal
    ? 'This list includes all the records that have been processed. Review them carefully.'
    : openValidRecordsModal
      ? 'All records in this list are valid and ready for the next step.'
      : 'The records listed here contain errors or missing information. Please update them to proceed with the transaction.'

  return (
    <Modal
      isOpen={openModalView}
      onClose={closeRecordsModal}
      // onConfirm={handleConfirmationClose}
      classNames={{ overlay: 'z-[55]' }}
      isDismissible={false}
      size={'full'}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="tracking-tight">
              <CardHeader
                className={'mt-12'}
                title={title}
                infoText={infoText}
              />
            </ModalHeader>
            <ModalBody className="gap-0">
              {/* IF MODAL OPENED AND TOTAL RECORDS ARRAY IS NOT EMPTY */}
              {openAllRecordsModal && batchDetails?.total && (
                <AllRecords records={batchDetails?.total} />
              )}

              {/* IF MODAL OPENED AND TOTAL VALID RECORDS ARRAY IS NOT EMPTY */}
              {openValidRecordsModal && batchDetails?.valid && (
                <ValidRecords records={batchDetails?.valid} />
              )}

              {/* IF MODAL OPENED AND TOTAL INVALID RECORDS ARRAY IS NOT EMPTY */}
              {openInvalidRecordsModal && batchDetails?.invalid?.length && (
                <InvalidRecords records={batchDetails?.invalid} />
              )}
            </ModalBody>
            {/* <ModalFooter>
              <Button color="danger" onPress={onClose}>
                {cancelText}
              </Button>
              <Button
                color="primary"
                isDisabled={isDisabled}
                isLoading={isLoading}
                onPress={onConfirm}
              >
                {confirmText}
              </Button>
            </ModalFooter> */}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default RecordDetailsViewer
