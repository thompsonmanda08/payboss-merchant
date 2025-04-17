"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import CustomTable from "@/components/tables/table";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import { INVOICE_COLUMNS, TILL_TRANSACTION_COLUMNS } from "@/lib/table-columns";
import InvoiceForm from "@/components/forms/invoice-form";
import { formatDate, notify } from "@/lib/utils";
import { useWorkspaceCheckout } from "@/hooks/useQueryHooks";
import {
  getCollectionLatestTransactions,
  getRecentInvoices,
} from "@/app/_actions/transaction-actions";
import { QUERY_KEYS } from "@/lib/constants";
import Invoice from "@/app/(external)/components/invoice";

export default function Invoicing({ workspaceID, permissions }) {
  const queryClient = useQueryClient();

  const { onOpen, onClose, isOpen } = useDisclosure();

  // CHECKOUT FOR A WORKSPACE CONFIG
  const { data: checkoutResponse, isLoading: isLoadingConfig } =
    useWorkspaceCheckout(workspaceID);
  const configData = checkoutResponse?.data || {};

  const [openViewInvoice, setOpenViewInvoice] = useState(false);
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const thirtyDaysAgoDate = new Date();
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, "YYYY-MM-DD");
  const end_date = formatDate(new Date(), "YYYY-MM-DD");

  // HANDLE FETCH LATEST INVOICE TRANSACTIONS
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.INVOICES, workspaceID],
    mutationFn: (dateRange) => getRecentInvoices(workspaceID, dateRange),
  });

  const transactionsMutation = useMutation({
    mutationKey: [QUERY_KEYS.INVOICE_COLLECTIONS, workspaceID],
    mutationFn: (dateRange) =>
      getCollectionLatestTransactions(workspaceID, "invoice", dateRange),
  });

  useEffect(() => {
    // IF NO DATA IS FETCH THEN GET THE LATEST INVOICES
    if (!mutation.data) {
      mutation.mutateAsync({ start_date, end_date });
    }

    // IF NO DATA IS FETCH THEN GET THE LATEST TRANSACTIONS
    if (!transactionsMutation.data) {
      transactionsMutation.mutateAsync({ start_date, end_date });
    }
  }, []);

  const LATEST_INVOICES = mutation.data?.data?.invoices || [];
  const INVOICE_TRANSACTIONS = transactionsMutation.data?.data?.data || [];

  function handleClosePrompts() {
    onClose();
    setOpenViewInvoice(false);
    setOpenCreateInvoice(false);
    setSelectedInvoice(null);
    // queryClient.invalidateQueries();
  }

  function handleOpenCreateModal() {
    // IF NOT CHECKOUT URL - CANNOT CREATE INVOICE
    if (!configData?.url) {
      notify({
        title: "Checkout Config not Found",
        description: "Please generate a checkout URL from workspace settings.",
        color: "danger",
      });

      return;
    }

    // OPEN MODAL
    onOpen();
    setOpenCreateInvoice(true);
  }

  function handleViewInvoice(ID) {
    const invoiceData = LATEST_INVOICES.find((invoice) => invoice.id === ID);

    const invoice = {
      id: invoiceData?.id || ID,
      workspaceID: invoiceData?.workspace_id,
      invoiceID: invoiceData?.invoice_id,
      date: invoiceData?.created_at,
      from: {
        name: invoiceData?.from?.display_name,
        address: invoiceData?.from?.physical_address,
        logo: invoiceData?.from?.logo,
        city: invoiceData?.from?.city,
        email: "",
      },
      billedTo: {
        name: invoiceData?.customer_name,
        address: invoiceData?.customer_address,
        city: invoiceData?.city,
        phone: invoiceData?.customer_phone_number,
        email: invoiceData?.customer_email,
      },
      items: invoiceData?.items?.map((item) => ({
        description: item?.description,
        quantity: parseInt(String(item?.quantity || "0")),
        price: parseFloat(String(item?.unit_price || "0")),
        amount: parseFloat(
          parseInt(String(item?.quantity || "0")) *
            parseFloat(String(item?.unit_price || "0")),
        ),
      })),
      taxRate: parseFloat(String(invoiceData?.tax_rate || "0")),
      tax: parseFloat(String(invoiceData?.tax || "0")),
      total: parseFloat(String(invoiceData?.total || "0")),

      status: invoiceData?.status,
      note:
        invoiceData?.description ||
        invoiceData?.notes ||
        "Thank you for doing business with us!",
    };

    setSelectedInvoice(invoice);
    setOpenViewInvoice(true);
    onOpen();
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between md:px-6">
          <CardHeader
            title={"Invoices"}
            infoText={"View and manage your invoices in one place."}
            classNames={{
              titleClasses: "xl:text-2xl lg:text-xl font-bold",
              infoClasses: "!text-sm xl:text-base",
            }}
          />

          <Button
            startContent={<PlusIcon className="h-6 w-6" />}
            onClick={handleOpenCreateModal}
          >
            Create New
          </Button>
        </div>
        <Card>
          <div className="flex w-full items-center mb-4">
            <CardHeader
              title={"Recent Invoices"}
              classNames={{
                infoClasses: "text-sm -mt-1",
              }}
              infoText={"Invoices made to your clients in the last 30days."}
            />
          </div>
          <CustomTable
            classNames={{ wrapper: "shadow-none px-0 mx-0" }}
            columns={INVOICE_COLUMNS}
            rowsPerPage={8}
            isLoading={mutation.isPending}
            removeWrapper
            rows={LATEST_INVOICES}
            onRowAction={handleViewInvoice}
            enableFilters={{
              status: true,
            }}
          />
        </Card>
        <Card>
          <div className="flex w-full items-center mb-4">
            <CardHeader
              title={"Recent Invoice Transactions"}
              classNames={{
                infoClasses: "text-sm -mt-1",
              }}
              infoText={
                "Invoice transactions made by your clients in the last 30days."
              }
            />
          </div>
          <CustomTable
            classNames={{ wrapper: "shadow-none px-0 mx-0" }}
            columns={TILL_TRANSACTION_COLUMNS}
            rowsPerPage={8}
            isLoading={transactionsMutation.isPending}
            removeWrapper
            rows={INVOICE_TRANSACTIONS}
            enableFilters={{
              status: true,
            }}
          />
        </Card>
      </div>

      <Modal
        backdrop="blur"
        isDismissable
        className={"z-[999]"}
        size="3xl"
        isOpen={isOpen && openCreateInvoice}
        onClose={handleClosePrompts}
      >
        <ModalContent>
          <ModalBody className="gap-0 max-h-[700px] overflow-y-auto">
            <InvoiceForm
              workspaceID={workspaceID}
              permissions={permissions}
              handleClosePrompts={handleClosePrompts}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* VIEW INVOICE  */}
      <Modal
        backdrop="blur"
        isDismissable
        className={"z-[999] max-h-[calc(100svh-60px)]"}
        size="3xl"
        isOpen={isOpen && openViewInvoice}
        onClose={handleClosePrompts}
      >
        <ModalContent>
          <ModalBody className="gap-0 w-full overflow-y-auto p-4">
            <Invoice
              invoice={selectedInvoice}
              className={"min-h-auto shadow-none"}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
