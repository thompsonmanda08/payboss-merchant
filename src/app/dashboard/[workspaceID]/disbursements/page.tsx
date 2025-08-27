import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants';
import { PageProps } from '@/types';

import BulkTransactionsTable from './_components/bulk-transactions-table';
import BatchDetailsModal from './_components/batch-details-modal';

export default async function DisbursementsPage({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;

  return (
    <>
      <Card className={'mb-8 w-full gap-4'}>
        <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
          <CardHeader
            classNames={{
              titleClasses: 'xl:text-2xl lg:text-xl font-bold',
              infoClasses: 'text-[15px] xl:text-base',
            }}
            infoText={
              'Make payments to your clients or multiple recipients simultaneously with direct/voucher transfers'
            }
            title={'Disbursement Transfers'}
          />
        </div>

        <BulkTransactionsTable
          key={PAYMENT_SERVICE_TYPES[0]?.name}
          workspaceID={workspaceID}
        />
      </Card>
      <BatchDetailsModal workspaceID={workspaceID} />
    </>
  );
}
