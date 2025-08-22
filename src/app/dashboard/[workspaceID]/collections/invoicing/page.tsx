import { PageProps } from '@/types';
import CreateNewInvoice from './_components/new-invoice';
import RecentInvoices from './_components/recent-invoices';
import RecentTransactions from '../api-integration/_components/recent-transactions';
import { QUERY_KEYS } from '@/lib/constants';

export default async function APIIntegrationPage({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;

  return (
    <div className="flex w-full flex-col gap-4">
      <CreateNewInvoice workspaceID={workspaceID} />
      <RecentInvoices workspaceID={workspaceID} />
      <RecentTransactions
        workspaceID={workspaceID}
        service="invoice"
        queryKeys={[QUERY_KEYS.INVOICE_COLLECTIONS]}
      />
    </div>
  );
}
