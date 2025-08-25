'use client';
import {
  Download as ArrowDownTrayIcon,
  Filter as FunnelIcon,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { walletStatementReportToCSV } from '@/app/_actions/file-conversion-actions';
import { WalletTransactionHistory } from '@/app/dashboard/[workspaceID]/workspace-settings/components/wallet';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import { Button } from '@/components/ui/button';
import { DateRangePickerField } from '@/components/ui/date-select-field';
import Search from '@/components/ui/search';
import { useDebounce } from '@/hooks/use-debounce';
import { QUERY_KEYS } from '@/lib/constants';
import { DateRangeFilter, Pagination as TPagination } from '@/types';
import { useWalletReports } from '@/hooks/use-query-data';
import { Pagination } from '@heroui/react';

export default function StatementReport({
  workspaceID,
}: {
  workspaceID: string;
}) {
  const queryClient = useQueryClient();

  const [dateRange, setDateRange] = useState<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [pagination, setPagination] = useState<TPagination>({
    page: 1,
    limit: 10,
  });

  const filters: DateRangeFilter = {
    start_date: dateRange?.start_date,
    end_date: dateRange?.end_date,
    ...pagination,
  };

  const {
    data: walletStatement,
    isLoading,
    isFetching,
  } = useWalletReports({
    workspaceID,
    filters,
  });

  const statementTransactions = walletStatement?.data?.data || [];
  const reportPagination = useMemo(
    () => walletStatement?.data?.pagination,
    [walletStatement?.data?.pagination],
  );

  // Implement manual CSV export functionality
  function handleFileExportToCSV() {
    walletStatementReportToCSV({ objArray: statementTransactions });
  }

  // RESOLVE DATA FILTERING
  const hasSearchFilter = Boolean(debouncedSearchQuery);

  const filteredItems = React.useMemo(() => {
    let filteredRows = [...statementTransactions];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter(
        (row) =>
          row?.ID?.toLowerCase().includes(
            debouncedSearchQuery?.toLowerCase(),
          ) ||
          row?.amount
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.type
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()),
      );
    }

    return filteredRows;
  }, [statementTransactions, debouncedSearchQuery]);

  const triggerRefetch = useCallback(async () => {
    const filters = {
      start_date: dateRange?.start_date,
      end_date: dateRange?.end_date,
      ...pagination,
    };

    const queryKey = [
      QUERY_KEYS.WALLET_STATEMENT_REPORTS,
      filters,
      workspaceID,
    ];

    queryClient.invalidateQueries({ queryKey });
    queryClient.refetchQueries({ queryKey });
  }, [queryClient, dateRange, pagination, workspaceID]);

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-start pb-2">
        <div className="flex items-center justify-end gap-2">
          <DateRangePickerField
            autoFocus
            dateRange={dateRange}
            description={'Dates to generate reports'}
            label={'Reports Date Range'}
            setDateRange={setDateRange}
            visibleMonths={2}
          />{' '}
          <Button
            endContent={<FunnelIcon className="h-5 w-5" />}
            onPress={triggerRefetch}
          >
            Apply
          </Button>
        </div>
      </div>
      {/************************************************************************/}

      <Card className={'mb-8 w-full'}>
        <div className="flex items-center gap-2">
          <CardHeader
            classNames={{
              titleClasses: 'xl:text-[clamp(1.125rem,1vw,1.75rem)] font-bold',
              infoClasses: 'text-[clamp(0.8rem,0.8vw,1rem)]',
            }}
            infoText={
              'Statement transactions:' +
              ` (${dateRange ? dateRange.range : '--'})`
            }
            title={'Wallet Statement Report'}
          />

          <div className="flex w-full max-w-sm gap-4">
            <Search
              placeholder={'Search for transaction...'}
              onChange={(v) => setSearchQuery(v)}
            />
            <Button
              endContent={<ArrowDownTrayIcon className="h-5 w-5" />}
              onPress={handleFileExportToCSV}
            >
              Export
            </Button>
          </div>
        </div>

        <WalletTransactionHistory
          isLoading={isLoading || isFetching}
          transactionData={filteredItems || []}
          workspaceID={workspaceID}
        />

        <div className="flex w-full items-center justify-between">
          <span className="text-small text-foreground-400">
            Total:{' '}
            {hasSearchFilter
              ? filteredItems.length
              : reportPagination?.total || 0}{' '}
            transactions
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={reportPagination?.page}
            total={reportPagination?.total_pages || 1}
            onChange={(page: any) =>
              setPagination((prev) => ({ ...prev, page }))
            }
          />
        </div>
      </Card>
    </>
  );
}
