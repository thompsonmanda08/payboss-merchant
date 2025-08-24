'use client';

import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import CustomTable from '@/components/tables/table';

import {
  API_KEY_TERMINAL_TRANSACTION_COLUMNS,
  API_KEY_TRANSACTION_COLUMNS,
  Columns,
  TILL_TRANSACTION_COLUMNS,
} from '@/lib/table-columns';
import {
  useRecentTransactions,
  useWorkspaceAPIKey,
  useWorkspaceTerminals,
} from '@/hooks/use-query-data';
import { formatDate } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { DateRangeFilter } from '@/types';

const RecentTransactions = ({
  workspaceID,
  service,
  queryKeys,
}: {
  workspaceID: string;
  service: string;
  queryKeys: string[];
}) => {
  const { data: API } = useWorkspaceAPIKey(workspaceID);
  const { data: TERMINALS } = useWorkspaceTerminals(workspaceID);

  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const thirtyDaysAgoDate = new Date();
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const start_date = formatDate(thirtyDaysAgoDate, 'YYYY-MM-DD');
  const end_date = formatDate(new Date(), 'YYYY-MM-DD');

  const filters: DateRangeFilter = {
    start_date, // YYYY-MM-DD
    end_date,
    ...pagination,
  };

  const terminals = TERMINALS?.data?.terminals || []; //
  const hasTerminals = Boolean(API?.data?.hasTerminals);
  const terminalsConfigured = Boolean(terminals.length > 0);

  // HANDLE FETCH API COLLECTION LATEST TRANSACTION DATA
  const { data: transactionData, isLoading } = useRecentTransactions({
    workspaceID,
    service,
    filters,
    queryKeys,
  });

  const LATEST_TRANSACTIONS = transactionData?.data?.data || [];
  const PAGINATION = {
    ...pagination, // USER SET CONFIGS FOR PAGINATION {page and limit}
    ...transactionData?.data?.pagination, // PAGINATION DETAILS FROM SERVER
  };

  // SET COLUMNS BASED ON SERVICE
  const getColumns = useCallback(
    (service: string): Columns => {
      switch (service) {
        case 'api-integration':
          return hasTerminals && terminalsConfigured
            ? API_KEY_TERMINAL_TRANSACTION_COLUMNS
            : API_KEY_TRANSACTION_COLUMNS;
        case 'invoice':
          return TILL_TRANSACTION_COLUMNS;

        default:
          return TILL_TRANSACTION_COLUMNS;
      }
    },
    [
      hasTerminals,
      terminalsConfigured,
      API_KEY_TERMINAL_TRANSACTION_COLUMNS,
      API_KEY_TRANSACTION_COLUMNS,
      TILL_TRANSACTION_COLUMNS,
    ],
  );

  return (
    <Card>
      <div className="flex w-full items-center justify-between gap-4">
        <CardHeader
          className={'mb-4'}
          infoText={
            'Transactions made to your workspace wallet in the last 30days.'
          }
          title={'Recent Transactions'}
        />
      </div>
      <CustomTable
        removeWrapper
        classNames={{ wrapper: 'shadow-none px-0 mx-0' }}
        columns={getColumns(service)}
        isLoading={isLoading}
        rows={LATEST_TRANSACTIONS}
        pagination={PAGINATION}
        handlePageChange={(page: number) => {
          setPagination((prev) => ({ ...prev, page }));
        }}
      />
    </Card>
  );
};

export default RecentTransactions;
