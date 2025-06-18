"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowDownTrayIcon,
  EyeSlashIcon,
  FunnelIcon,
  ListBulletIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import Search from "@/components/ui/search";
import CustomTable from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { DateRangePickerField } from "@/components/ui/date-select-field";
import { QUERY_KEYS } from "@/lib/constants";
import { getCollectionsReport } from "@/app/_actions/transaction-actions";
import TotalStatsLoader from "@/app/dashboard/components/total-stats-loader";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import Tabs from "@/components/elements/tabs";
import TotalValueStat from "@/app/dashboard/components/total-stats";
import { billTransactionsReportToCSV } from "@/app/_actions/file-conversion-actions";
import { BILLS_TRANSACTION_COLUMNS } from "@/lib/table-columns";

const SERVICE_TYPES = [
  {
    name: "BIll Payment Reports",
    description:
      "Reports on Bill API transactions that took place within the date range applied",
    index: 0,
    service: "bill", // SERVICE TYPE REQUIRED BY API ENDPOINT
  },
];

export default function BillPaymentReports({ workspaceID }) {
  const [dateRange, setDateRange] = useState();
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);

  // HANDLE FETCH FILTERED TRANSACTION REPORT DATA
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.COLLECTION_REPORTS, workspaceID],
    mutationFn: (filterDates) => getReportsData(filterDates),
  });

  // ABSTRACT THE DATE RANGE FROM THE DATE PICKER - TO FETCH ASYNCHRONOUSLY
  async function runAsyncMutation(range) {
    // IF NO DATE RANGE IS SELECTED, RETURN EMPTY ARRAY
    if (!range?.start_date && !range?.end_date) {
      return [];
    }

    return await mutation.mutateAsync(range);
  }

  // FETCH BILLS REPORT DATA - ASYNC AS HOISTED INTO THE MUTATION FUNCTION
  async function getReportsData(dateRange) {
    let serviceType = SERVICE_TYPES[currentTab]?.service;

    if (!serviceType) {
      serviceType = "bill";
    }

    const response = await getCollectionsReport(
      workspaceID,
      serviceType,
      dateRange,
    );

    return response || [];
  }

  // MUTATION RESPONSE DATA
  const report = mutation?.data?.data?.summary || [];
  const transactions = mutation?.data?.data?.data || [];

  // RESOLVE DATA FILTERING
  const hasSearchFilter = Boolean(searchQuery);
  const filteredItems = React.useMemo(() => {
    let filteredRows = [...transactions];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter(
        (row) =>
          // row?.narration?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          row?.transactionID
            ?.toLowerCase()
            .includes(searchQuery?.toLowerCase()) ||
          row?.amount?.toLowerCase().includes(searchQuery?.toLowerCase()),
      );
    }

    return filteredRows;
  }, [transactions, searchQuery]);

  useEffect(() => {
    if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
      runAsyncMutation(dateRange);
    }
  }, [dateRange]);

  function handleFileExportToCSV() {
    if (currentTab === 0) {
      billTransactionsReportToCSV({
        objArray: transactions,
        fileName: "bill_payment_transactions",
      });
    }
  }

  useEffect(() => {
    runAsyncMutation(dateRange);
  }, [currentTab]);

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-start pb-2">
        <div className="flex items-center gap-2">
          <DateRangePickerField
            autoFocus
            dateRange={dateRange}
            description={"Dates to generate reports"}
            label={"Reports Date Range"}
            setDateRange={setDateRange}
            visibleMonths={2}
          />{" "}
          <Button
            endContent={<FunnelIcon className="h-5 w-5" />}
            onPress={() => runAsyncMutation(dateRange)}
          >
            Apply
          </Button>
        </div>
      </div>
      {/************************************************************************/}
      <Card className={"w-full gap-3"}>
        <div className="flex items-end justify-between">
          <Tabs
            className={"mb-2 mr-auto"}
            currentTab={currentTab}
            navigateTo={setCurrentTab}
            tabs={SERVICE_TYPES}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-8">
          <CardHeader
            classNames={{
              titleClasses: "xl:text-[clamp(1.125rem,1vw,1.75rem)] font-bold",
              infoClasses: "text-[clamp(0.8rem,0.8vw,1rem)]",
            }}
            infoText={SERVICE_TYPES[currentTab].description}
            title={`${SERVICE_TYPES[currentTab].name} (${
              dateRange?.range || "--"
            })`}
          />

          <div className="flex w-full max-w-md gap-4">
            <Search
              // className={'mt-auto'}
              classNames={{ input: "h-10" }}
              placeholder={"Search by name, or type..."}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <Button
              color={"primary"}
              startContent={<ArrowDownTrayIcon className="h-5 w-5" />}
              onPress={() => handleFileExportToCSV()}
            >
              Export
            </Button>
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

        {
          <AnimatePresence>
            <motion.div
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              initial={{ height: 0, opacity: 0 }}
            >
              {/* OVERALL SUMMARY */}
              <Card className={"mb-4 mt-2 shadow-none"}>
                {Object.keys(report).length > 0 ? (
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div className="flex-1">
                      <TotalValueStat
                        count={transactions.length || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "primary",
                        }}
                        label={"Total Transactions"}
                        value={""}
                      />
                    </div>
                    <div className="flex-1">
                      <TotalValueStat
                        count={report?.successful_count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "success",
                        }}
                        label={"Successful Transactions"}
                        value={formatCurrency(report?.successful_value)}
                      />
                    </div>

                    <div className="flex-1">
                      <TotalValueStat
                        count={report?.failed_count || 0}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "danger",
                        }}
                        label={"Failed Transactions"}
                        value={formatCurrency(report?.failed_value || 0)}
                      />
                    </div>
                  </div>
                ) : (
                  <TotalStatsLoader className={"justify-between"} />
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        }
        {/* {activeTab} */}
        <CustomTable
          removeWrapper
          columns={BILLS_TRANSACTION_COLUMNS}
          isError={mutation.isError}
          isLoading={mutation.isPending}
          rows={filteredItems || []}
          onRowAction={(key) => {}}
        />
      </Card>

      {/************************************************************************/}
    </>
  );
}
