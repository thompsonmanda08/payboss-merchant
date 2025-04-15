"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Alert,
  Snippet,
  ModalHeader,
  ModalFooter,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import CustomTable from "@/components/tables/table";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import { INVOICE_COLUMNS } from "@/lib/table-columns";
import InvoiceForm from "@/components/forms/invoice-form";
import { notify } from "@/lib/utils";
import { useWorkspaceCheckout } from "@/hooks/useQueryHooks";

export default function CheckoutAndInvoicing({ workspaceID, permissions }) {
  const queryClient = useQueryClient();

  const { onOpen, onClose, isOpen } = useDisclosure();

  // CHECKOUT FOR A WORKSPACE CONFIG
  const { data: checkoutResponse, isLoading: isLoadingConfig } =
    useWorkspaceCheckout(workspaceID);
  const configData = checkoutResponse?.data || {};

  const [openViewConfig, setOpenViewConfig] = useState(false);
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);

  function handleClosePrompts() {
    onClose();
    setOpenViewConfig(false);
    setOpenCreateInvoice(false);
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

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card>
          <div className="flex w-full items-center justify-between">
            <CardHeader
              classNames={{
                titleClasses: "xl:text-2xl lg:text-xl font-bold",
                infoClasses: "!text-sm xl:text-base",
              }}
              infoText={"Invoices made to your clients in the last 30days."}
              title={"Recent Invoices"}
            />

            <Button
              startContent={<PlusIcon className="h-6 w-6" />}
              onClick={handleOpenCreateModal}
            >
              Create New
            </Button>
          </div>
          <CustomTable
            classNames={{ wrapper: "shadow-none px-0 mx-0" }}
            columns={INVOICE_COLUMNS}
            rowsPerPage={12}
            // isLoading={mutation.isPending}
            // removeWrapper
            rows={[]}
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
              permissions={permissions}
              handleClosePrompts={handleClosePrompts}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* VIEW INVOICE  */}
      <Modal
        isDismissable
        isKeyboardDismissDisabled
        className={"z-[99] max-w-full 2xl:max-w-[calc(100svw-200px)]"}
        isOpen={isOpen && openViewConfig}
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader className="tracking-tight">{"Checkout URL"}</ModalHeader>
          <ModalBody className="gap-0">
            <div className="flex w-full flex-col gap-8">
              <Snippet hideSymbol className="w-full flex-1">
                <p className="text-wrap">{configData?.url}</p>
              </Snippet>
              <div className="flex flex-col gap-2">
                <h4 className="text-base font-bold text-slate-600">
                  URL Anatomy
                </h4>
                <Snippet hideSymbol className="w-full">
                  <p>
                    {
                      "{BASE_URL}/checkout/?checkout_id='xxxxxxxxx'&workspace_id='xxxxxxxxx'&service_id='xxxxxxxx'"
                    }
                    <span className="font-bold">
                      {"&amount='1.0'&transaction_id='XXXXXXXX'"}
                    </span>
                  </p>
                </Snippet>
                <div className="w-full flex items-center my-3">
                  <Alert
                    color={"warning"}
                    title={
                      <span>
                        Please replace the 'XXXXXX' placeholder ONLY on the
                        <span className="font-bold mx-1 uppercase">amount</span>
                        &amp;
                        <span className="font-bold mx-1 uppercase">
                          transaction_id
                        </span>
                        <span>
                          {`fields with your own values as you do your integration for this workspace`}
                        </span>
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleClosePrompts}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
