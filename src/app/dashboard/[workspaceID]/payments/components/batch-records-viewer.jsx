"use client";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import usePaymentsStore from "@/context/payment-store";
import { useBatchDetails } from "@/hooks/useQueryHooks";
import CardHeader from "@/components/base/card-header";
import { SINGLE_TRANSACTIONS_VALIDATION_COLUMNS } from "@/lib/table-columns";
import SingleTransactionsTable from "@/components/tables/single-transaction-table";

function RecordDetailsViewer({ batchID }) {
  const {
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    closeRecordsModal,
    selectedBatch,
  } = usePaymentsStore();

  const { data: batchResponse } = useBatchDetails(selectedBatch?.ID || batchID);
  const batchData = selectedBatch || batchResponse?.data;

  // Determine which modal view to open
  const openModalView =
    (openInvalidRecordsModal && batchData?.invalid?.length) ||
    openValidRecordsModal ||
    openAllRecordsModal;

  const title = openInvalidRecordsModal
    ? "Invalid Records"
    : openValidRecordsModal
      ? "Valid Records"
      : "All Records";

  const infoText = openAllRecordsModal
    ? "This list includes all the records that have been processed. Review them carefully."
    : openValidRecordsModal
      ? "All records in this list are valid and ready for the next step."
      : "The records listed here contain errors or missing information. Please update them to proceed with the transaction.";

  return (
    <Modal
      isDismissable={false}
      isOpen={openModalView}
      onClose={closeRecordsModal}
      // onConfirm={handleConfirmationClose}
      classNames={{
        overlay: "z-[55]",
        base: "max-w-[calc(100vw-180px)] min-h-[calc(100vh-200px)]",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="tracking-tight">
              <CardHeader infoText={infoText} title={title} />
            </ModalHeader>
            <ModalBody className="gap-0">
              {/* IF MODAL OPENED AND TOTAL RECORDS ARRAY IS NOT EMPTY */}
              {openAllRecordsModal && batchData?.total && (
                <SingleTransactionsTable
                  removeWrapper
                  columnData={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                  rowData={batchData?.total}
                />
              )}

              {/* IF MODAL OPENED AND TOTAL VALID RECORDS ARRAY IS NOT EMPTY */}
              {openValidRecordsModal && batchData?.valid && (
                <SingleTransactionsTable
                  removeWrapper
                  columnData={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                  rowData={batchData?.valid}
                />
              )}

              {/* IF MODAL OPENED AND TOTAL INVALID RECORDS ARRAY IS NOT EMPTY */}
              {openInvalidRecordsModal && batchData?.invalid?.length && (
                <SingleTransactionsTable
                  removeWrapper
                  columnData={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                  rowData={batchData?.invalid}
                />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default RecordDetailsViewer;
