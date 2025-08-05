"use client";
import Modal from "@/components/modals/custom-modal";
import SingleTransactionsTable from "@/components/tables/single-transaction-table";

function ReportDetailsViewer({
  columns,
  batch,
  setSelectedBatch,
  openReportsModal,
  setOpenReportsModal,
  isLoading,
}: {
  columns: any;
  batch: any;
  setSelectedBatch: any;
  openReportsModal: any;
  setOpenReportsModal: any;
  isLoading: any;
}) {
  return (
    <Modal
      classNames={{ overlay: "z-[55]", container: "px-2" }}
      onClose={() => {
        setOpenReportsModal(false);
        setSelectedBatch(null);
      }}
      // onConfirm={handleConfirmationClose}
      disableAction={true}
      height={400}
      infoText={"Track each transactions status throughout the payment process"}
      isDismissible={false}
      loading={isLoading}
      removeCallToAction={true}
      show={openReportsModal}
      title={"Transaction Report Details"}
      width={1440}
    >
      <SingleTransactionsTable
        removeWrapper
        columnData={columns}
        isLoading={isLoading}
        rowData={batch?.transactions}
      />
    </Modal>
  );
}

export default ReportDetailsViewer;
