'use client'
import React from 'react'
import { singleReportsColumns } from '@/context/paymentsStore'
import SingleTransactionsTable from '../tables/SingleTransactionsTable'
import Modal from '@/components/base/Modal'

function ReportDetailsViewer({
  columns,
  batch,
  openReportsModal,
  setOpenReportsModal,
  isLoading,
}) {
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
