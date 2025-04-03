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
    batchDetails: batchState,
  } = usePaymentsStore();

  const { data: batch } = useBatchDetails(batchState?.ID || batchID);
  const batchDetails = batch?.data;

  // Determine which modal view to open
  const openModalView =
    (openInvalidRecordsModal && batchDetails?.invalid?.length) ||
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
      classNames={{ overlay: "z-[55]", base: "max-w-[1440px]" }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="tracking-tight">
              <CardHeader infoText={infoText} title={title} />
            </ModalHeader>
            <ModalBody className="gap-0">
              {/* IF MODAL OPENED AND TOTAL RECORDS ARRAY IS NOT EMPTY */}
              {openAllRecordsModal && batchDetails?.total && (
                <SingleTransactionsTable
                  removeWrapper
                  columnData={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                  rowData={batchDetails?.total}
                />
              )}

              {/* IF MODAL OPENED AND TOTAL VALID RECORDS ARRAY IS NOT EMPTY */}
              {openValidRecordsModal && batchDetails?.valid && (
                <SingleTransactionsTable
                  removeWrapper
                  columnData={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                  rowData={batchDetails?.valid}
                />
              )}

              {/* IF MODAL OPENED AND TOTAL INVALID RECORDS ARRAY IS NOT EMPTY */}
              {openInvalidRecordsModal && batchDetails?.invalid?.length && (
                <SingleTransactionsTable
                  removeWrapper
                  columnData={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                  rowData={batchDetails?.invalid}
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
