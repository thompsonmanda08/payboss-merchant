"use client";
import React, { useEffect, useState } from "react";
import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import Search from "@/components/ui/search";
import CustomTable from "@/components/containers/tables/Table";
import {
  ArrowDownTrayIcon,
  EyeSlashIcon,
  FunnelIcon,
  ListBulletIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

import { DateRangePickerField } from "@/components/ui/date-select-field";
import { useDateFormatter } from "@react-aria/i18n";
import { BULK_REPORTS_QUERY_KEY } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { getBulkAnalyticReports } from "@/app/_actions/transaction-actions";
import { AnimatePresence, motion } from "framer-motion";
import ReportDetailsViewer from "@/components/containers/analytics/ReportDetailsViewer";
import TotalStatsLoader from "@/app/dashboard/components/total-stats-loader";
import { bulkTransactionsReportToCSV } from "@/app/_actions/file-conversion-actions";
import Card from "@/components/base/card";
import CardHeader from "@/components/base/card-header";
import Tabs from "@/components/tabs";
import TotalValueStat from "@/app/dashboard/components/total-stats";
import {
  BULK_REPORTS_COLUMNS,
  SINGLE_TRANSACTION_REPORTS_COLUMNS,
} from "@/lib/table-columns";
import { useDebounce } from "@/hooks/use-debounce";

const SERVICE_TYPES = [
  {
    name: "Bulk Direct Payments",
    index: 0,
  },
  {
    name: "Bulk Voucher Payments",
    index: 1,
  },
];

export default function DisbursementReports({ workspaceID }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [dateRange, setDateRange] = useState({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [openReportsModal, setOpenReportsModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null); // ON ROW SELECTED
  let formatter = useDateFormatter({ dateStyle: "long" });

  // HANDLE FETCH BULK REPORT DATA
  const mutation = useMutation({
    mutationKey: [BULK_REPORTS_QUERY_KEY, workspaceID],
    mutationFn: (dateRange) => getBulkAnalyticReports(workspaceID, dateRange),
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
          row?.name?.toLowerCase().includes(debouncedSearchQuery?.toLowerCase())
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
          row?.name?.toLowerCase().includes(debouncedSearchQuery?.toLowerCase())
      );
    }

    return filteredRows;
  }, [report, debouncedSearchQuery]);

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      key={`direct-payments-${workspaceID}`}
      columns={BULK_REPORTS_COLUMNS}
      rows={filteredDirectBatches}
      isLoading={mutation.isPending}
      isError={mutation.isError}
      removeWrapper
      onRowAction={handleBatchSelection}
    />,
    <CustomTable
      key={`voucher-payments-${workspaceID}`}
      columns={BULK_REPORTS_COLUMNS}
      rows={filteredVoucherBatches}
      isLoading={mutation.isPending}
      isError={mutation.isError}
      onRowAction={handleBatchSelection}
      removeWrapper
    />,
  ]);

  async function getBulkReportData(range) {
    return await mutation.mutateAsync(range);
  }

  function handleBatchSelection(ID) {
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
        fileName: "direct_bulk_transactions",
      });
      return;
    }
    if (currentTabIndex === 1) {
      bulkTransactionsReportToCSV({
        objArray: voucherBatches,
        fileName: "voucher_bulk_transactions",
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
            label={"Reports Date Range"}
            description={"Dates to generate transactional reports"}
            visibleMonths={2}
            autoFocus
            dateRange={dateRange}
            setDateRange={setDateRange}
          />{" "}
          <Button
            onPress={() => getBulkReportData(dateRange)}
            endContent={<FunnelIcon className="h-5 w-5" />}
          >
            Apply
          </Button>
        </div>
      </div>
      {/************************************************************************/}
      <Card className={"mb-8 w-full"}>
        <div className="flex items-end justify-between">
          <CardHeader
            title={`Bulk Transactions History (${dateRange?.range || "--"})`}
            infoText={
              "Transactions logs to keep track of your workspace activity"
            }
          />

          <div className="flex gap-4">
            <Button
              color={"primary"}
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
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <Card className={"mt-4 gap-5 shadow-none"}>
              {Object.keys(report).length > 0 ? (
                <>
                  <div className="flex flex-col flex-wrap sm:flex-row md:justify-between">
                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        label={"Total Batches"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "primary",
                        }}
                        count={report?.batches?.count || 0}
                        value={formatCurrency(report?.batches?.value || 0)}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        label={"Total Direct Batches"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "primary-800",
                        }}
                        count={report?.direct?.all?.count || 0}
                        value={formatCurrency(report?.direct?.all?.value || 0)}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        label={"Total Voucher Batches"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "secondary",
                        }}
                        count={report?.voucher?.all?.count || 0}
                        value={formatCurrency(report?.voucher?.all?.value || 0)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col flex-wrap sm:flex-row md:justify-evenly">
                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        label={"Processed Direct Transactions"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "primary-800",
                        }}
                        count={report?.direct?.proccessed?.count || 0}
                        value={formatCurrency(
                          report?.direct?.proccessed?.value || 0
                        )}
                      />
                      <TotalValueStat
                        label={"Processed Voucher Transactions"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "secondary",
                        }}
                        count={report?.voucher?.proccessed?.count || 0}
                        value={formatCurrency(
                          report?.voucher?.proccessed?.value || 0
                        )}
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        label={"Successful Direct Transactions"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "success",
                        }}
                        count={
                          report?.directTransactions?.successful?.count || 0
                        }
                        value={formatCurrency(
                          report?.directTransactions?.successful?.value || 0
                        )}
                      />
                      <TotalValueStat
                        label={"Failed Direct Transactions"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "danger",
                        }}
                        count={report?.directTransactions?.failed?.count || 0}
                        value={formatCurrency(
                          report?.directTransactions?.failed?.value || 0
                        )}
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <TotalValueStat
                        label={"Successful Voucher Transactions"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "success",
                        }}
                        count={
                          report?.voucherTransactions?.successful?.count || 0
                        }
                        value={formatCurrency(
                          report?.voucherTransactions?.successful?.value || 0
                        )}
                      />
                      <TotalValueStat
                        label={"Failed Voucher Transactions"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "danger",
                        }}
                        count={report?.voucherTransactions?.failed?.count || 0}
                        value={formatCurrency(
                          report?.voucherTransactions?.failed?.value || 0
                        )}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <TotalStatsLoader length={8} className={"flex-wrap"} />
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </Card>

      <Card className={"mb-8 w-full"}>
        <div className="mb-4 flex w-full items-center justify-between gap-8">
          <Tabs
            className={"my-2 mr-auto max-w-md"}
            tabs={SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />
          <div className="flex w-full max-w-md gap-4">
            <Search
              // className={'mt-auto'}
              placeholder={"Search by name, or type..."}
              classNames={{ input: "h-10" }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <Button
              onPress={handleFileExportToCSV}
              startContent={<ArrowDownTrayIcon className="h-5 w-5" />}
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
          setOpenReportsModal={setOpenReportsModal}
          openReportsModal={openReportsModal}
          setSelectedBatch={setSelectedBatch}
          columns={SINGLE_TRANSACTION_REPORTS_COLUMNS}
          batch={selectedBatch}
        />
      )}
      {/************************************************************************/}
    </>
  );
}
