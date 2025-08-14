'use client';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';

import CardHeader from '@/components/base/card-header';
import SingleTransactionsTable from '@/components/tables/single-transaction-table';
import Loader from '@/components/ui/loader';
import usePaymentsStore from '@/context/payment-store';
import { SINGLE_TRANSACTIONS_VALIDATION_COLUMNS } from '@/lib/table-columns';

function RecordDetailsViewer({ batch }: { batch: any }) {
  const {
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    closeRecordsModal,
  } = usePaymentsStore();

  // Determine which modal view to open
  const openModalView =
    (openInvalidRecordsModal && batch?.invalid?.length) ||
    openValidRecordsModal ||
    openAllRecordsModal;

  const title = openInvalidRecordsModal
    ? 'Invalid Records'
    : openValidRecordsModal
      ? 'Valid Records'
      : 'All Records';

  const infoText = openAllRecordsModal
    ? 'This list includes all the records that have been processed. Review them carefully.'
    : openValidRecordsModal
      ? 'All records in this list are valid and ready for the next step.'
      : 'The records listed here contain errors or missing information. Please update them to proceed with the transaction.';

  return (
    <Modal
      isDismissable={false}
      isOpen={openModalView}
      onClose={closeRecordsModal}
      // onConfirm={handleConfirmationClose}
      classNames={{
        backdrop: "z-[55]",
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
              {!batch?.total ? (
                <Loader loadingText={'Processing batch...'} size={80} />
              ) : (
                <>
                  {/* IF MODAL OPENED AND TOTAL RECORDS ARRAY IS NOT EMPTY */}
                  {openAllRecordsModal && batch?.total && (
                    <SingleTransactionsTable
                      removeWrapper
                      columnData={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                      rowData={batch?.total}
                    />
                  )}

                  {/* IF MODAL OPENED AND TOTAL VALID RECORDS ARRAY IS NOT EMPTY */}
                  {openValidRecordsModal && batch?.valid && (
                    <SingleTransactionsTable
                      removeWrapper
                      columnData={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                      rowData={batch?.valid}
                    />
                  )}

                  {/* IF MODAL OPENED AND TOTAL INVALID RECORDS ARRAY IS NOT EMPTY */}
                  {openInvalidRecordsModal && batch?.invalid?.length && (
                    <SingleTransactionsTable
                      removeWrapper
                      columnData={SINGLE_TRANSACTIONS_VALIDATION_COLUMNS}
                      rowData={batch?.invalid}
                    />
                  )}
                </>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default RecordDetailsViewer;
