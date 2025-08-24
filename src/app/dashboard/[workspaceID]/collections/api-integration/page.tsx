import { PageProps } from '@/types';
import TerminalsConfig from './_components/terminals-api-config';
import RecentTransactions from './_components/recent-transactions';
import { QUERY_KEYS } from '@/lib/constants';
import APIKeyConfig from './_components/api-key-config';

export default async function APIIntegrationPage({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID as string;

  return (
    <div className="flex w-full flex-col gap-4">
      <APIKeyConfig workspaceID={workspaceID} />
      <TerminalsConfig workspaceID={workspaceID} />
      <RecentTransactions
        workspaceID={workspaceID}
        service="api-integration"
        queryKeys={[QUERY_KEYS.API_COLLECTIONS]}
      />
    </div>
  );
}
