'use client';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  addToast,
} from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Invoice from '@/app/(external)/_components/invoice';
import {
  getCollectionLatestTransactions,
  getRecentInvoices,
} from '@/app/_actions/transaction-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import InvoiceForm from '@/components/forms/invoice-form';
import CustomTable from '@/components/tables/table';
import { Button } from '@/components/ui/button';
import { useWorkspaceCheckout } from '@/hooks/use-query-data';
import { QUERY_KEYS } from '@/lib/constants';
import { INVOICE_COLUMNS, TILL_TRANSACTION_COLUMNS } from '@/lib/table-columns';
import { formatDate } from '@/lib/utils';

export default function InvoicingPage({}) {
  const params = useParams();
  const workspaceID = String(params.workspaceID);
  const queryClient = useQueryClient();

  const { onOpen, onClose, isOpen } = useDisclosure();

  //!!! CHECKOUT FOR A WORKSPACE CONFIG  IS REQUIRED
  const { data: checkoutResponse } = useWorkspaceCheckout(workspaceID);
  const configData = checkoutResponse?.data || {};

  const [openViewInvoice, setOpenViewInvoice] = useState(false);
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const thirtyDaysAgoDate = new Date();

  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD');
  const end_date = formatDate(new Date(), 'YYYY-MM-DD');

  const { data: invoices, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.INVOICES, workspaceID],
    queryFn: () => getRecentInvoices(workspaceID, { start_date, end_date }),
  });

  const transactionsMutation = useMutation({
    mutationKey: [QUERY_KEYS.INVOICE_COLLECTIONS, workspaceID],
    mutationFn: (dateRange) =>
      getCollectionLatestTransactions(workspaceID, 'invoice', dateRange),
  });

  useEffect(() => {
    // IF DATA IS NULL THEN GET THE LATEST INVOICES
    if (!invoices?.data) {
      // mutation.mutateAsync({ start_date, end_date });
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.INVOICES, workspaceID],
      });
    }

    // IF NO DATA IS FETCH THEN GET THE LATEST TRANSACTIONS
    if (!transactionsMutation?.data) {
      transactionsMutation.mutateAsync({ start_date, end_date } as any);
    }
  }, []);

  const LATEST_INVOICES = invoices?.data?.invoices || [];
  const INVOICE_TRANSACTIONS = transactionsMutation?.data?.data?.data || [];

  function handleClosePrompts() {
    onClose();
    setOpenViewInvoice(false);
    setOpenCreateInvoice(false);
    setSelectedInvoice(null);
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

  function handleViewInvoice(ID: string) {
    const invoiceData = LATEST_INVOICES.find(
      (invoice: any) => invoice.id === ID,
    );

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
        email: '',
      },
      billedTo: {
        name: invoiceData?.customer_name,
        address: invoiceData?.customer_address,
        city: invoiceData?.city,
        phone: invoiceData?.customer_phone_number,
        email: invoiceData?.customer_email,
      },
      items: invoiceData?.items?.map((item: any) => ({
        description: item?.description,
        quantity: parseInt(String(item?.quantity || '0')),
        price: parseFloat(String(item?.unit_price || '0')),
        amount: parseFloat(
          String(
            parseInt(String(item?.quantity || '0')) *
              parseFloat(String(item?.unit_price || '0')),
          ),
        ),
      })),
      taxRate: parseFloat(String(invoiceData?.tax_rate || '0')),
      tax: parseFloat(String(invoiceData?.tax || '0')),
      total: parseFloat(String(invoiceData?.total || '0')),

      status: invoiceData?.status,
      note:
        invoiceData?.description ||
        invoiceData?.notes ||
        'Thank you for doing business with us!',
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
        <Card>
          <div className="flex w-full items-center mb-4">
            <CardHeader
              classNames={{
                infoClasses: 'text-sm -mt-1',
              }}
              infoText={'Invoices made to your clients in the last 30days.'}
              title={'Recent Invoices'}
            />
          </div>
          <CustomTable
            removeWrapper
            classNames={{ wrapper: 'shadow-none px-0 mx-0' }}
            columns={INVOICE_COLUMNS}
            filters={{
              status: {
                enabled: true,
              },
            }}
            isLoading={isLoading}
            limitPerRow={8}
            rows={LATEST_INVOICES}
            onRowAction={handleViewInvoice}
          />
        </Card>
        <Card>
          <div className="flex w-full items-center mb-4">
            <CardHeader
              classNames={{
                infoClasses: 'text-sm -mt-1',
              }}
              infoText={
                'Invoice transactions made by your clients in the last 30days.'
              }
              title={'Recent Invoice Transactions'}
            />
          </div>
          <CustomTable
            removeWrapper
            classNames={{ wrapper: 'shadow-none px-0 mx-0' }}
            columns={TILL_TRANSACTION_COLUMNS}
            filters={{
              status: {
                enabled: true,
              },
            }}
            isLoading={transactionsMutation.isPending}
            limitPerRow={8}
            rows={INVOICE_TRANSACTIONS}
          />
        </Card>
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

      {/* VIEW INVOICE  */}
      <Modal
        isDismissable
        backdrop="blur"
        className={'z-[999] max-h-[calc(100svh-60px)]'}
        isOpen={isOpen && openViewInvoice}
        size="3xl"
        onClose={handleClosePrompts}
      >
        <ModalContent>
          <ModalBody className="gap-0 w-full overflow-y-auto p-4">
            <Invoice
              className={'min-h-auto shadow-none bg-transparent mt-6'}
              invoice={selectedInvoice}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
