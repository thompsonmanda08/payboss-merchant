'use client';
import {
  ArrowDownTrayIcon,
  EyeSlashIcon,
  FunnelIcon,
  ListBulletIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { bulkTransactionsReportToCSV } from '@/app/_actions/file-conversion-actions';
import { getBulkAnalyticReports } from '@/app/_actions/transaction-actions';
import ReportDetailsViewer from "@/app/dashboard/components/ReportDetailsViewer";
import TotalValueStat from "@/app/dashboard/components/total-stats";
import TotalStatsLoader from "@/app/dashboard/components/total-stats-loader";
import CardHeader from "@/components/base/card-header";
import Card from '@/components/base/custom-card';
import Tabs from "@/components/elements/tabs";
import CustomTable from '@/components/tables/table';
import { Button } from '@/components/ui/button';
import { DateRangePickerField } from '@/components/ui/date-select-field';
import Search from '@/components/ui/search';
import useCustomTabsHook from '@/hooks/use-custom-tabs';
import { useDebounce } from "@/hooks/use-debounce";
import { QUERY_KEYS } from '@/lib/constants';
import {
  BULK_REPORTS_COLUMNS,
  SINGLE_TRANSACTION_REPORTS_COLUMNS,
} from "@/lib/table-columns";
import { formatCurrency } from '@/lib/utils';
import { DateRangeFilter } from '@/types';

const SERVICE_TYPES = [
  {
    name: 'Bulk Direct Payments',
    index: 0,
  },
  {
    name: 'Bulk Voucher Payments',
    index: 1,
  },
];

export default function DisbursementReports({}) {
  const params = useParams();
  const workspaceID = String(params.workspaceID);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [openReportsModal, setOpenReportsModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null); // ON ROW SELECTED
  // let formatter = useDateFormatter({ dateStyle: "long" });

  // HANDLE FETCH BULK REPORT DATA
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.BULK_REPORTS, workspaceID],
    mutationFn: () => getBulkAnalyticReports(workspaceID, dateRange),
  });

  const report = mutation?.data?.data || [];
  const directBatches = report?.directBatches || [];
  const voucherBatches = report?.voucherBatches || [];

  // RESOLVE DATA FILTERING
  const hasSearchFilter = Boolean(debouncedSearchQuery);

  const filteredDirectBatches = React.useMemo(() => {
    let filteredRows = [...(report?.directBatches || [])];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter(
        (row) =>
          row?.transactionID
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.name
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()),
      );
    }

    return filteredRows;
  }, [report, debouncedSearchQuery]);

  const filteredVoucherBatches = React.useMemo(() => {
    let filteredRows = [...(report?.voucherBatches || [])];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter(
        (row) =>
          row?.transactionID
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.name
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()),
      );
    }

    return filteredRows;
  }, [report, debouncedSearchQuery]);

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      key={`direct-payments-${workspaceID}`}
      removeWrapper
      columns={BULK_REPORTS_COLUMNS}
      isLoading={mutation.isPending}
      rows={filteredDirectBatches}
      onRowAction={handleBatchSelection}
    />,
    <CustomTable
      key={`voucher-payments-${workspaceID}`}
      removeWrapper
      columns={BULK_REPORTS_COLUMNS}
      isLoading={mutation.isPending}
      rows={filteredVoucherBatches}
      onRowAction={handleBatchSelection}
    />,
  ]);

  async function getBulkReportData(range: DateRangeFilter) {
    return await mutation.mutateAsync();
  }

  function handleBatchSelection(ID: string) {
    let batch = null;

    if (currentTabIndex === 0) {
      batch = filteredDirectBatches.find((row) => row.ID == ID);
    }

    if (currentTabIndex === 1) {
      batch = filteredVoucherBatches.find((row) => row.ID == ID);
    }
    setSelectedBatch(batch);
    setOpenReportsModal(true);
  }

  function handleFileExportToCSV() {
    if (currentTabIndex === 0) {
      bulkTransactionsReportToCSV({
        objArray: directBatches,
        fileName: 'direct_bulk_transactions',
      });

      return;
    }
    if (currentTabIndex === 1) {
      bulkTransactionsReportToCSV({
        objArray: voucherBatches,
        fileName: 'voucher_bulk_transactions',
      });

      return;
    }
  }

  useEffect(() => {
    if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
      getBulkReportData(dateRange);
    }
  }, [dateRange]);

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-start pb-2">
        <div className="flex items-center gap-2">
          <DateRangePickerField
            autoFocus
            dateRange={dateRange}
            description={'Dates to generate transactional reports'}
            label={'Reports Date Range'}
            setDateRange={setDateRange}
            visibleMonths={2}
          />{' '}
          <Button
            endContent={<FunnelIcon className="h-5 w-5" />}
            onPress={() => getBulkReportData(dateRange)}
          >
            Apply
          </Button>
        </div>
      </div>
      {/************************************************************************/}
      <Card className={'mb-8 w-full'}>
        <div className="flex items-end justify-between">
          <CardHeader
            infoText={
              'Transactions logs to keep track of your workspace activity'
            }
            title={`Bulk Transactions History (${dateRange?.range || '--'})`}
          />

          <div className="flex gap-4">
            <Button
              color={'primary'}
              variant="flat"
              onPress={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <EyeSlashIcon className="h-5 w-5" /> Hide Summary
                </>
              ) : (
                <>
                  <PresentationChartBarIcon className="h-5 w-5" />
                  Show Summary
                </>
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          <motion.div
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            initial={{ height: 0, opacity: 0 }}
          >
            <Card className={'mt-4 gap-5 shadow-none'}>
              {Object.keys(report).length > 0 ? (
                <>
                  <div className="flex flex-col flex-wrap sm:flex-row md:justify-between">
                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        count={report?.batches?.count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'primary',
                        }}
                        label={'Total Batches'}
                        value={formatCurrency(report?.batches?.value || 0)}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        count={report?.direct?.all?.count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'primary-800',
                        }}
                        label={'Total Direct Batches'}
                        value={formatCurrency(report?.direct?.all?.value || 0)}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        count={report?.voucher?.all?.count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'secondary',
                        }}
                        label={'Total Voucher Batches'}
                        value={formatCurrency(report?.voucher?.all?.value || 0)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col flex-wrap sm:flex-row md:justify-evenly">
                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        count={report?.direct?.proccessed?.count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'primary-800',
                        }}
                        label={'Processed Direct Transactions'}
                        value={formatCurrency(
                          report?.direct?.proccessed?.value || 0,
                        )}
                      />
                      <TotalValueStat
                        count={report?.voucher?.proccessed?.count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'secondary',
                        }}
                        label={'Processed Voucher Transactions'}
                        value={formatCurrency(
                          report?.voucher?.proccessed?.value || 0,
                        )}
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        count={
                          report?.directTransactions?.successful?.count || 0
                        }
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'success',
                        }}
                        label={'Successful Direct Transactions'}
                        value={formatCurrency(
                          report?.directTransactions?.successful?.value || 0,
                        )}
                      />
                      <TotalValueStat
                        count={report?.directTransactions?.failed?.count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'danger',
                        }}
                        label={'Failed Direct Transactions'}
                        value={formatCurrency(
                          report?.directTransactions?.failed?.value || 0,
                        )}
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        count={
                          report?.voucherTransactions?.successful?.count || 0
                        }
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'success',
                        }}
                        label={'Successful Voucher Transactions'}
                        value={formatCurrency(
                          report?.voucherTransactions?.successful?.value || 0,
                        )}
                      />
                      <TotalValueStat
                        count={report?.voucherTransactions?.failed?.count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: 'danger',
                        }}
                        label={'Failed Voucher Transactions'}
                        value={formatCurrency(
                          report?.voucherTransactions?.failed?.value || 0,
                        )}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <TotalStatsLoader className={'flex-wrap'} length={8} />
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </Card>

      <Card className={'mb-8 w-full'}>
        <div className="mb-4 flex w-full items-center justify-between gap-8">
          <Tabs
            className={'my-2 mr-auto max-w-md'}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
            tabs={SERVICE_TYPES}
          />
          <div className="flex w-full max-w-md gap-4">
            <Search
              // className={'mt-auto'}
              classNames={{ input: 'h-10' }}
              placeholder={'Search by name, or type...'}
              onChange={(v) => {
                setSearchQuery(v);
              }}
            />
            <Button
              startContent={<ArrowDownTrayIcon className="h-5 w-5" />}
              onPress={handleFileExportToCSV}
            >
              Export
            </Button>
          </div>
        </div>
        {activeTab}
      </Card>

      {/**************** IF TOP_OVER RENDERING IS REQUIRED *******************/}
      {openReportsModal && (
        <ReportDetailsViewer
          batch={selectedBatch}
          columns={SINGLE_TRANSACTION_REPORTS_COLUMNS}
          openReportsModal={openReportsModal}
          setOpenReportsModal={setOpenReportsModal}
          setSelectedBatch={setSelectedBatch}
        />
      )}
      {/************************************************************************/}
    </>
  );
}
