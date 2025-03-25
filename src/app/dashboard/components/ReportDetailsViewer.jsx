"use client";
import React from "react";
import SingleTransactionsTable from "../tables/SingleTransactionsTable";
import Modal from "@/components/base/custom-modal";

function ReportDetailsViewer({
  columns,
  batch,
  setSelectedBatch,
  openReportsModal,
  setOpenReportsModal,
  isLoading,
}) {
  return (
    <Modal
      show={openReportsModal}
      onClose={() => {
        setOpenReportsModal(false);
        setSelectedBatch(null);
      }}
      // onConfirm={handleConfirmationClose}
      title={"Transaction Report Details"}
      infoText={"Track each transactions status throughout the payment process"}
      classNames={{ overlay: "z-[55]", container: "px-2" }}
      isDismissible={false}
      disableAction={true}
      removeCallToAction={true}
      loading={isLoading}
      width={1440}
      height={400}
    >
      <SingleTransactionsTable
        columnData={columns}
        rowData={batch?.transactions}
        isLoading={isLoading}
        removeWrapper
      />
    </Modal>
  );
}

export default ReportDetailsViewer;
