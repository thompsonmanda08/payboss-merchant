'use client'
import React from 'react'
import {
  singleReportsColumns,
  validationColumns,
} from '@/context/paymentsStore'
import { useBatchDetails } from '@/hooks/useQueryHooks'
import { CardHeader, Modal } from '@/components/base'
import SummaryTable from '../tables/SummaryTable'
import SingleTransactionsTable from '../tables/SingleTransactionsTable'

function ReportDetailsViewer({
  columns,
  batch,
  openReportsModal,
  setOpenReportsModal,
  isLoading,
}) {
  // const { data: batch } = useBatchDetails(batchID)
  // const batchDetails = batch?.data

  return (
    <Modal
      show={openReportsModal}
      onClose={() => {
        setOpenReportsModal(false)
      }}
      // onConfirm={handleConfirmationClose}
      title={'Transaction Report Details'}
      infoText={'Track each transactions status througout the payment proccess'}
      classNames={{ overlay: 'z-[55]', container: 'px-2' }}
      isDismissible={false}
      disableAction={true}
      removeCallToAction={true}
      loading={isLoading}
      width={1440}
      height={400}
    >
      <SingleTransactionsTable
        columnData={singleReportsColumns}
        rowData={batch?.transactions}
        isLoading={isLoading}
        removeWrapper
      />
    </Modal>
  )
}

export default ReportDetailsViewer
