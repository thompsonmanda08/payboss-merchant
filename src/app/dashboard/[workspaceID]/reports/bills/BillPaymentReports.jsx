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
import { COLLECTION_REPORTS_QUERY_KEY } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { getCollectionsReport } from "@/app/_actions/transaction-actions";
import { AnimatePresence, motion } from "framer-motion";

import TotalStatsLoader from "@/components/elements/total-stats-loader";
import Card from "@/components/base/Card";
import CardHeader from "@/components/base/CardHeader";
import Tabs from "@/components/elements/tabs";
import TotalValueStat from "@/components/elements/total-stats";
import { convertToCSVString } from "@/app/_actions/file-conversion-actions";
import { BILLS_TRANSACTION_COLUMNS } from "../../bills/bill-payments";

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

  // HANDLE FETCH FILTERED TRANSACTION REPORT DATA
  const mutation = useMutation({
    mutationKey: [COLLECTION_REPORTS_QUERY_KEY, workspaceID],
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
      dateRange
    );
    return response || [];
  }

  // MUTATION RESPONSE DATA
  const report = mutation?.data?.data?.summary || [];
  const transactions = mutation?.data?.data?.data || [];

  // RESOLVE DATA FILTERING
  const hasSearchFilter = Boolean(searchQuery);
  const filteredItems = React.useMemo(() => {
    let filteredrows = [...transactions];

    if (hasSearchFilter) {
      filteredrows = filteredrows.filter(
        (row) =>
          // row?.narration?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          row?.transactionID
            ?.toLowerCase()
            .includes(searchQuery?.toLowerCase()) ||
          row?.amount?.toLowerCase().includes(searchQuery?.toLowerCase())
      );
    }

    return filteredrows;
  }, [transactions, searchQuery]);

  useEffect(() => {
    if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
      runAsyncMutation(dateRange);
    }
  }, [dateRange]);

  function handleFileExportToCSV() {
    let columnHeaders;
    // Implement CSV export functionality here
    if (currentTab === 0) {
      convertToCSVString({
        objArray: transactions,
        // columnHeaders,
        fileName: "bill_payment_transactions",
      });
    }
  }

  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    runAsyncMutation(dateRange);
  }, [currentTab]);

  return (
    <>
      <div className="mb-4 flex w-full items-start justify-start pb-2">
        <div className="flex items-center gap-2">
          <DateRangePickerField
            label={"Reports Date Range"}
            description={"Dates to generate reports"}
            visibleMonths={2}
            autoFocus
            dateRange={dateRange}
            setDateRange={setDateRange}
          />{" "}
          <Button
            onPress={() => runAsyncMutation(dateRange)}
            endContent={<FunnelIcon className="h-5 w-5" />}
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
            tabs={SERVICE_TYPES}
            currentTab={currentTab}
            navigateTo={setCurrentTab}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-8">
          <CardHeader
            title={`${SERVICE_TYPES[currentTab].name} (${
              dateRange?.range || "--"
            })`}
            infoText={SERVICE_TYPES[currentTab].description}
            classNames={{
              titleClasses: "xl:text-[clamp(1.125rem,1vw,1.75rem)] font-bold",
              infoClasses: "text-[clamp(0.8rem,0.8vw,1rem)]",
            }}
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
              color={"primary"}
              onPress={() => handleFileExportToCSV()}
              startContent={<ArrowDownTrayIcon className="h-5 w-5" />}
            >
              Export
            </Button>
            <Button
              color={"primary"}
              variant="flat"
              onPress={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <PresentationChartBarIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        {/* TODO:  THIS CAN BE ONCE SINGLE COMPONENT */}
        {
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
            >
              <Card className={"mb-4 mt-2 shadow-none"}>
                {Object.keys(report).length > 0 ? (
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div className="flex-1">
                      <TotalValueStat
                        label={"Total Transactions"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "primary",
                        }}
                        count={transactions.length || 0}
                        value={""}
                      />
                    </div>
                    <div className="flex-1">
                      <TotalValueStat
                        label={"Successful Transactions"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "success",
                        }}
                        count={report?.successful_count || 0}
                        value={formatCurrency(report?.successful_value)}
                      />
                    </div>

                    <div className="flex-1">
                      <TotalValueStat
                        label={"Failed Transactions"}
                        icon={{
                          component: <ListBulletIcon className="h-5 w-5" />,
                          color: "danger",
                        }}
                        count={report?.failed_count || 0}
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
          columns={BILLS_TRANSACTION_COLUMNS}
          rows={filteredItems || []}
          isLoading={mutation.isPending}
          isError={mutation.isError}
          removeWrapper
          onRowAction={(key) => {}}
        />
      </Card>

      {/************************************************************************/}
    </>
  );
}
