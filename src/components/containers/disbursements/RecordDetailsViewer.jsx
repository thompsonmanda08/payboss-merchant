'use client'
import React from 'react'

import { Modal } from '@/components/base'
import AllRecords from '../tables/AllRecords'
import ValidRecords from '../tables/ValidRecords'
import InvalidRecords from '../tables/InvalidRecords'
import usePaymentsStore from '@/context/paymentsStore'

function RecordDetailsViewer() {
  const {
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    closeRecordsModal,
    batchDetails,
  } = usePaymentsStore()

  async function handleConfirmationClose() {
    // TODO => HANDLE RESUBMISSION FOR INVALID RECORDS
    // If there are invalid records, open the modal again with the same data
    // if (batchDetails.invalid.length > 0) {
    //   const response = await submitInvalidRecordsForReview()
    // }

    closeRecordsModal()
  }

  return (
    <Modal
      show={
        openInvalidRecordsModal || openValidRecordsModal || openAllRecordsModal
      }
      onClose={closeRecordsModal}
      onConfirm={handleConfirmationClose}
      title={
        openInvalidRecordsModal
          ? 'Invalid Records'
          : openValidRecordsModal
            ? 'Valid Records'
            : 'All Records'
      }
      infoText={
        openAllRecordsModal
          ? 'This list includes all the records that have been processed. Review them carefully.'
          : openValidRecordsModal
            ? 'All records in this list are valid and ready for the next step.'
            : 'The records listed here contain errors or missing information. Please update them to proceed with the transaction.'
      }
      width={1680}
    >
      {/* IF MODAL OPENED AND TOTAL RECORDS ARRAY IS NOT EMPTY */}
      {openAllRecordsModal && batchDetails?.total && (
        <AllRecords records={batchDetails?.total} />
      )}

      {/* IF MODAL OPENED AND TOTAL VALID RECORDS ARRAY IS NOT EMPTY */}
      {openValidRecordsModal && batchDetails?.valid && (
        <ValidRecords records={batchDetails?.valid} />
      )}

      {/* IF MODAL OPENED AND TOTAL INVALID RECORDS ARRAY IS NOT EMPTY */}
      {openInvalidRecordsModal && batchDetails?.invalid && (
        <InvalidRecords records={batchDetails?.invalid} />
      )}
    </Modal>
  )
}

export default RecordDetailsViewer
