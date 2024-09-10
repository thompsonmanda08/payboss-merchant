'use client'
import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/modal'
import {
  singleReportsColumns,
  validationColumns,
} from '@/context/paymentsStore'
import { useBatchDetails } from '@/hooks/useQueryHooks'
import { CardHeader } from '@/components/base'
import SummaryTable from '../tables/SummaryTable'

function ReportDetailsViewer({
  columns,
  batchID,
  openReportsModal,
  setOpenReportsModal,
}) {
  const { data: batch } = useBatchDetails(batchID)
  const batchDetails = batch?.data

  return (
    <Modal
      isOpen={openReportsModal}
      onClose={() => {
        setOpenReportsModal(false)
      }}
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
                className={'mt-10'}
                title={'TransactionReport Details'}
                // infoText={""}
              />
            </ModalHeader>
            <ModalBody className="gap-0">
              {/* IF MODAL OPENED AND TOTAL RECORDS ARRAY IS NOT EMPTY */}
              <SummaryTable columns={columns} data={batchDetails?.invalid} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ReportDetailsViewer
