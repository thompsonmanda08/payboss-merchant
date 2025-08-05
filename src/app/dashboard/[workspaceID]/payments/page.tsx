"use client";

import { useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useParams } from "next/navigation";

import usePaymentsStore from "@/context/payment-store";
import { PAYMENT_SERVICE_TYPES } from "@/lib/constants";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import OverlayLoader from "@/components/ui/overlay-loader";

import BulkTransactionsTable from "./components/bulk-transactions-table";
import BatchDetailsPage from "./components/batch-details-view";
import SelectPaymentType from "./components/payment-protocol-selection";

export default function DisbursementsWrapper({}) {
  const params = useParams();
  const workspaceID = params.workspaceID;
  const { onClose } = useDisclosure();
  const { openPaymentsModal, openBatchDetailsModal } = usePaymentsStore();
  const [createPaymentLoading, setCreatePaymentLoading] = useState(false);

  return (
    <>
      <Card className={"mb-8 w-full gap-4"}>
        <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
          <CardHeader
            classNames={{
              titleClasses: "xl:text-2xl lg:text-xl font-bold",
              infoClasses: "text-[15px] xl:text-base",
            }}
            infoText={
              "Make payments to your clients or multiple recipients simultaneously with direct/voucher transfers"
            }
            title={"Disbursement Transfers"}
          />
        </div>

        <BulkTransactionsTable
          key={PAYMENT_SERVICE_TYPES[0]?.name}
          // rows={bulkTransactions}
          workspaceID={workspaceID}
        />
      </Card>

      {/************************************************************************/}
      {/* MODALS && OVERLAYS */}

      {createPaymentLoading && <OverlayLoader show={createPaymentLoading} />}

      {openPaymentsModal && (
        <SelectPaymentType
          // protocol={"direct"}
          setCreatePaymentLoading={setCreatePaymentLoading}
        />
      )}

      {openBatchDetailsModal && (
        <BatchDetailsPage
          isOpen={openBatchDetailsModal}
          protocol={"direct"}
          onClose={onClose}
        />
      )}

      {/************************************************************************/}
    </>
  );
}
