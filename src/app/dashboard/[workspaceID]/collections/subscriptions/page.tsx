import { PageProps } from '@/types';
import SubscriptionManagement from './_components/subscription-management';
import RecentTransactions from '../api-integration/_components/recent-transactions';
import { QUERY_KEYS } from '@/lib/constants';

export default async function SubscriptionsPage({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;

  return (
    <div className="flex w-full flex-col gap-4">
      <SubscriptionManagement workspaceID={workspaceID} />
      <RecentTransactions
        workspaceID={workspaceID}
        service="subscription"
        queryKeys={[QUERY_KEYS.API_COLLECTIONS]}
      />
    </div>
  );
}