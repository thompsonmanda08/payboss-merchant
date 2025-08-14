import { PageProps } from '@/types';

import BulkPaymentForm from './bulk-payment-form';

export default async function CreateBatchPayment({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;
  const protocol = (await params)?.protocol as string;

  return (
    <>
      <BulkPaymentForm protocol={protocol} workspaceID={workspaceID} />
    </>
  );
}
