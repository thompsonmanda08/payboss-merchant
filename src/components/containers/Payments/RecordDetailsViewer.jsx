'use client'
import React from 'react'

import { Modal } from '@/components/base'
import AllRecords from '../Tables/AllRecords'
import ValidRecords from '../Tables/ValidRecords'
import InvalidRecords from '../Tables/InvalidRecords'
import usePaymentsStore from '@/context/paymentsStore'

function RecordDetailsViewer() {
  const {
    updatePaymentFields,
    paymentAction,
    resetPaymentData,
    openPaymentsModal,
    setOpenPaymentsModal,
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    setOpenAllRecordsModal,
    setOpenValidRecordsModal,
    setOpenInvalidRecordsModal,
    openRecordsModal,
    closeRecordsModal,
  } = usePaymentsStore()

  return (
    <Modal
      show={
        openInvalidRecordsModal || openValidRecordsModal || openAllRecordsModal
      }
      onClose={closeRecordsModal}
      onConfirm={closeRecordsModal}
      title={
        openAllRecordsModal
          ? 'All Records'
          : openValidRecordsModal
            ? 'Valid Records'
            : 'Invalid Records'
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
      {openAllRecordsModal && <AllRecords />}
      {openValidRecordsModal && <ValidRecords />}
      {openInvalidRecordsModal && <InvalidRecords />}
    </Modal>
  )
}

export default RecordDetailsViewer
