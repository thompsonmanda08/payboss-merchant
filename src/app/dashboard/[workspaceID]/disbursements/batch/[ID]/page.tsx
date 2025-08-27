import { getBatchDetails } from '@/app/_actions/transaction-actions';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import ActionableEmptyState from '@/components/elements/empty-state-with-action';
import { PageProps, Pagination } from '@/types';
import BatchDetails from './batch-details';
import ApproverAction from '../../_components/approver-action';

export default async function BatchDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;
  const batchID = (await params)?.ID as string;

  // GET PAGE AND LIMIT FROM SEARCH PARAMS
  const page = Number((await searchParams)?.page) || 0;
  const limit = Number((await searchParams)?.limit) || 10;

  if (!batchID) {
    return (
      <>
        <ActionableEmptyState
          title="Batch ID is required"
          description="You need to provide a batch ID"
        ></ActionableEmptyState>
      </>
    );
  }

  const response = await getBatchDetails(workspaceID, batchID, {page, limit});
  const batch =
    response?.data?.batch ||
    response?.data?.transactions ||
    response?.data?.data;

  const pagination = {
    page,
    limit,
    ...response?.data?.pagination,
  } as Pagination;

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
              'Details of the payment action batch files and the approval status'
            }
            title={`${batch?.batch_name} - Batch Details`}
          />
          <ApproverAction workspaceID={workspaceID} batch={batch} />
        </div>

        <BatchDetails batch={batch} pagination={pagination} />
      </Card>
    </>
  );
}
