'use client';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  addToast,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import CardHeader from '@/components/base/card-header';
import InvoiceForm from '@/components/forms/invoice-form';
import { Button } from '@/components/ui/button';
import { useWorkspaceCheckout } from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';

export default function CreateNewInvoice({
  workspaceID,
}: {
  workspaceID: string;
}) {
  const queryClient = useQueryClient();

  const { onOpen, onClose, isOpen } = useDisclosure();

  //!!! CHECKOUT FOR A WORKSPACE CONFIG  IS REQUIRED
  const { data: checkoutResponse } = useWorkspaceCheckout(workspaceID);
  const configData = checkoutResponse?.data || {};
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);

  function handleClosePrompts() {
    onClose();
    setOpenCreateInvoice(false);
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.INVOICES, workspaceID],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.INVOICE_COLLECTIONS, workspaceID],
    });
    // mutation.mutateAsync({ start_date, end_date });
  }

  function handleOpenCreateModal() {
    // IF NOT CHECKOUT URL - CANNOT CREATE INVOICE
    if (!configData?.url) {
      addToast({
        title: 'Checkout Config not Found',
        description: 'Please generate a checkout URL from workspace settings.',
        color: 'danger',
      });

      return;
    }

    // OPEN MODAL
    onOpen();
    setOpenCreateInvoice(true);
  }

  return (
    <>
      <div className="flex w-full items-center justify-between md:px-6">
        <CardHeader
          classNames={{
            titleClasses: 'xl:text-2xl lg:text-xl font-bold',
            infoClasses: '!text-sm xl:text-base',
          }}
          infoText={'View and manage your invoices in one place.'}
          title={'Invoices'}
        />

        <Button
          startContent={<PlusIcon className="h-6 w-6" />}
          onClick={handleOpenCreateModal}
        >
          Create New
        </Button>
      </div>

      <Modal
        isDismissable
        backdrop="blur"
        className={'z-[999]'}
        isOpen={isOpen && openCreateInvoice}
        size="3xl"
        onClose={handleClosePrompts}
      >
        <ModalContent>
          <ModalBody className="gap-0 max-h-[700px] overflow-y-auto">
            <InvoiceForm
              handleClosePrompts={handleClosePrompts}
              workspaceID={workspaceID}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
