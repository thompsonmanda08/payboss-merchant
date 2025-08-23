'use client';
import { Modal, ModalContent, ModalBody, useDisclosure } from '@heroui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import Invoice from '@/app/(external)/_components/invoice';
import { getRecentInvoices } from '@/app/_actions/transaction-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import CustomTable from '@/components/tables/table';
import { QUERY_KEYS } from '@/lib/constants';
import { INVOICE_COLUMNS } from '@/lib/table-columns';
import { formatDate } from '@/lib/utils';
import { Invoice as InvoiceType } from '@/types/invoice';

export default function RecentInvoices({
  workspaceID,
}: {
  workspaceID: string;
}) {
  const queryClient = useQueryClient();

  const { onOpen, onClose, isOpen } = useDisclosure();

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(
    null,
  );
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const thirtyDaysAgoDate = new Date();

  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD');
  const end_date = formatDate(new Date(), 'YYYY-MM-DD');

  const { data: invoices, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.INVOICES, workspaceID],
    queryFn: () =>
      getRecentInvoices(workspaceID, { start_date, end_date, ...pagination }),
  });

  useEffect(() => {
    // IF DATA IS NULL THEN GET THE LATEST INVOICES
    if (!invoices?.data) {
      // mutation.mutateAsync({ start_date, end_date });
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.INVOICES, workspaceID],
      });
    }
  }, []);

  const LATEST_INVOICES = invoices?.data?.invoices || [];
  const PAGINATION = {
    ...pagination, // USER SET CONFIGS FOR PAGINATION {page and limit}
    ...invoices?.data?.pagination, // PAGINATION DETAILS FROM SERVER
  };

  function handleClosePrompts() {
    onClose();
    setSelectedInvoice(null);
  }

  const handleViewInvoice = useCallback(
    (invoiceId: string) => {
      const selected = LATEST_INVOICES.find(
        (invoice: any) => invoice.id === invoiceId,
      );

      const invoice: InvoiceType = {
        id: selected?.id || invoiceId,
        workspaceID: selected?.workspace_id,
        invoiceID: selected?.invoice_id,
        date: selected?.created_at,
        from: {
          name: selected?.from?.display_name,
          address: selected?.from?.physical_address,
          logo: selected?.from?.logo,
          city: selected?.from?.city,
          email: '',
        },
        billedTo: {
          name: selected?.customer_name,
          address: selected?.customer_address,
          city: selected?.city,
          phone: selected?.customer_phone_number,
          email: selected?.customer_email,
        },
        items: selected?.items?.map((item: any) => ({
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
        taxRate: parseFloat(String(selected?.tax_rate || '0')),
        tax: parseFloat(String(selected?.tax || '0')),
        total: parseFloat(String(selected?.total || '0')),
        dueAmount: parseFloat(String(selected?.balance || '0')),

        status: selected?.status,
        note:
          selected?.description ||
          selected?.notes ||
          'Thank you for doing business with us!',
      };

      setSelectedInvoice(invoice);
      onOpen();
    },
    [LATEST_INVOICES],
  );

  return (
    <>
      <Card>
        <div className="flex w-full items-center">
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
            dateFormat: 'dd/MM/yyyy',
            status: {
              enabled: true,
            },
          }}
          isLoading={isLoading}
          limitPerRow={10}
          rows={LATEST_INVOICES}
          onRowAction={handleViewInvoice}
          pagination={PAGINATION}
          handlePageChange={(page: number) => {
            setPagination((prev) => ({ ...prev, page }));
          }}
          searchKeys={['invoice_id', 'customer_name']}
        />
      </Card>

      {/* VIEW INVOICE  */}
      <Modal
        isDismissable={false}
        backdrop="blur"
        className={'z-[999] max-h-[calc(100svh-60px)]'}
        isOpen={isOpen && selectedInvoice !== null}
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
