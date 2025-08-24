import { PageProps } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import RecentTransactions from '../api-integration/_components/recent-transactions';
import CreateNewTillNumber from './_components/new-till-number';

export default async function APIIntegrationPage({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;

  return (
    <div className="flex w-full flex-col gap-4">
      <CreateNewTillNumber workspaceID={workspaceID} />
      <RecentTransactions
        workspaceID={workspaceID}
        service="till"
        queryKeys={[QUERY_KEYS.TILL_COLLECTIONS]}
      />
    </div>
  );
}
