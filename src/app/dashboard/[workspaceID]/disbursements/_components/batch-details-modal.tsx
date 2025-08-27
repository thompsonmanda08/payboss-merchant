'use client';
import { Modal, ModalContent, ModalBody, ModalHeader } from '@heroui/react';
import { useState } from 'react';

import ApproverAction from '@/app/dashboard/[workspaceID]/disbursements/_components/approver-action';
import CardHeader from '@/components/base/card-header';
import usePaymentsStore from '@/context/payment-store';
import { useBatchDetails } from '@/hooks/use-query-data';
import CustomTable from '@/components/tables/table';
import { SINGLE_TRANSACTIONS_VALIDATION_COLUMNS } from '@/lib/table-columns';

export default function BatchDetailsModal({
  workspaceID,
  onClose,
}: {
  workspaceID: string;
  onClose?: () => void;
}) {
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const { selectedBatch, openBatchDetailsModal, setOpenBatchDetailsModal } =
    usePaymentsStore();

  const { data: batchResponse, isLoading } = useBatchDetails({
    workspaceID,
    batchID: selectedBatch?.id || '',
    filters: { ...pagination },
  });

  const batch = selectedBatch;
  const transactions = batchResponse?.data?.details || [];

  const PAGINATION = {
    ...batchResponse?.data?.pagination,
    ...pagination,
  };

  return (
    <>
      <Modal
        isDismissable={false}
        isOpen={openBatchDetailsModal}
        // size={'5xl'}
        backdrop="blur"
        classNames={{
          backdrop: '',
          base: 'max-w-[calc(100vw-180px)] min-h-[calc(100vh-200px)]',
        }}
        onClose={() => {
          onClose?.();
          setOpenBatchDetailsModal(false);
        }}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex gap-1 items-end justify-between">
              <CardHeader
                infoText={'Details for the payment action batch files'}
                title={
                  <>
                    Batch Details{' '}
                    {
                      batch && (
                        <span className="capitalize">
                          - ({batch?.batch_name}){' '}
                        </span>
                      ) //ONLY FOR THE CREATE PAYMENTS PAGE
                    }
                  </>
                }
              />

              <ApproverAction workspaceID={workspaceID} batch={batch} />
            </ModalHeader>

            <ModalBody>
              <CustomTable
                removeWrapper
                columns={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                rows={transactions}
                limitPerRow={10}
                isLoading={isLoading}
                pagination={PAGINATION}
                handlePageChange={(page) => {
                  setPagination((prev) => ({ ...prev, page }));
                }}
              />
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
