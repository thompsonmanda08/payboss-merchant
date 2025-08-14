'use client';
import { ArrowDownTrayIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { walletStatementReportToCSV } from '@/app/_actions/file-conversion-actions';
import { getWalletStatementReport } from '@/app/_actions/transaction-actions';
import { WalletTransactionHistory } from '@/app/dashboard/[workspaceID]/workspace-settings/components/wallet';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import { Button } from '@/components/ui/button';
import { DateRangePickerField } from '@/components/ui/date-select-field';
import Search from '@/components/ui/search';
import { useDebounce } from '@/hooks/use-debounce';
import { QUERY_KEYS } from '@/lib/constants';

export default function StatementReport({}) {
  const params = useParams();
  const workspaceID = String(params.workspaceID);

  const [dateRange, setDateRange] = useState<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.WALLET_STATEMENT_REPORTS, workspaceID],
    mutationFn: (filterDates) => getReportsData(filterDates),
  });

  const statementTransactions = mutation?.data?.data?.data || [];

  // handle get wallet history asynchronously with a date mutation - date range
  async function runAsyncMutation(range: any) {
    if (!range?.start_date && !range?.end_date) {
      return [];
    }
    await mutation.mutateAsync(range);
  }

  async function getReportsData(range: any) {
    const response = await getWalletStatementReport(workspaceID, range);

    return response || [];
  }

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

  useEffect(() => {
    if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
      runAsyncMutation(dateRange);

      return;
    }
  }, [dateRange]);

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
            onPress={() => runAsyncMutation(dateRange)}
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
          isLoading={mutation.isPending}
          transactionData={filteredItems || []}
          workspaceID={workspaceID}
        />
      </Card>
    </>
  );
}
