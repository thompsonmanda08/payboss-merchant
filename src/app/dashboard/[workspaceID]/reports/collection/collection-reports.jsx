"use client";
import React, { useEffect, useState } from "react";
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

import TotalStatsLoader from "@/app/dashboard/components/total-stats-loader";
import Card from "@/components/base/card";
import CardHeader from "@/components/base/card-header";
import Tabs from "@/components/tabs";
import TotalValueStat from "@/app/dashboard/components/total-stats";
import { apiTransactionsReportToCSV } from "@/app/_actions/file-conversion-actions";
import {
  API_KEY_TERMINAL_TRANSACTION_COLUMNS,
  API_KEY_TRANSACTION_COLUMNS,
} from "@/lib/table-columns";
import { TerminalInfo } from "@/components/containers/tables/terminal-tables";
import { useDebounce } from "@/hooks/use-debounce";

const SERVICE_TYPES = [
  {
    name: "API Transactions Reports",
    description:
      "Reports on API transactions that took place within the date range applied",
    index: 0,
    service: "api-integration", // SERVICE TYPE REQUIRED BY API ENDPOINT
  },
  {
    name: "Till Transactions Reports",
    description:
      "Reports on till transactions that took place within the date range applied",
    index: 1,
    service: "till", // SERVICE TYPE REQUIRED BY API ENDPOINT
  },
];

export default function CollectionsReports({ workspaceID }) {
  const [dateRange, setDateRange] = useState(); // DATE RANGE FILTER

  const [isExpanded, setIsExpanded] = useState(true); // SUMMARY EXPANDED STATE
  const [currentTab, setCurrentTab] = useState(0); // CURRENTLY ACTIVE TAB

  const [searchQuery, setSearchQuery] = useState(""); // TABLE SEARCH FILTER
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [terminalQuery, setTerminalQuery] = useState(""); // TERMINAL SEARCH FILTER
  const debouncedTerminalQuery = useDebounce(terminalQuery, 500);

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

  // FETCH COLLECTIONS REPORT DATA - ASYNC AS HOISTED INTO THE MUTATION FUNCTION
  async function getReportsData(dateRange) {
    let serviceType = SERVICE_TYPES[currentTab]?.service;

    if (!serviceType) {
      serviceType = "api-integration";
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
  const hasTerminals = Boolean(mutation?.data?.data?.hasTerminal || false);
  const terminalSummary = mutation?.data?.data?.terminal || [];

  // RESOLVE DATA FILTERING
  const hasSearchFilter = Boolean(debouncedSearchQuery);
  const filteredItems = React.useMemo(() => {
    let filteredRows = [...transactions];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter(
        (row) =>
          // row?.narration?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          row?.transactionID
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.destination
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.amount
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase()) ||
          row?.service_provider
            ?.toLowerCase()
            .includes(debouncedSearchQuery?.toLowerCase())
      );
    }

    return filteredRows;
  }, [transactions, debouncedSearchQuery]);

  // RESOLVE TERMINAL FILTERING
  const hasTerminalFilter = Boolean(debouncedTerminalQuery);
  const filteredTerminals = React.useMemo(() => {
    let terminals = [...terminalSummary];

    if (hasTerminalFilter) {
      terminals = terminals.filter(
        (terminal) =>
          terminal?.terminal_name
            ?.toLowerCase()
            .includes(debouncedTerminalQuery?.toLowerCase()) ||
          terminal?.terminalName
            ?.toLowerCase()
            .includes(debouncedTerminalQuery?.toLowerCase()) ||
          terminal?.terminalID
            ?.toLowerCase()
            .includes(debouncedTerminalQuery?.toLowerCase())
      );
    }

    return terminals;
  }, [terminalSummary, debouncedTerminalQuery]);

  // APPLY DATE RANGE FILTERING
  useEffect(() => {
    if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
      runAsyncMutation(dateRange);
    }
  }, [dateRange]);

  function handleFileExportToCSV() {
    if (currentTab === 0)
      apiTransactionsReportToCSV({
        objArray: transactions,
        fileName: "api_collection_transactions",
        hasTerminals,
      });

    if (currentTab === 1) {
      apiTransactionsReportToCSV({
        objArray: transactions,
        fileName: "till_collection_transactions",
        hasTerminals: false, //? TILL COLLECTION CANNOT HAVE TERMINALS
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

          <div className="flex w-full justify-end gap-4">
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
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              className="mb-4"
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
                  <div className="flex flex-col gap-8">
                    <TotalStatsLoader className={"justify-between"} />
                    <TotalStatsLoader className={"justify-between"} />
                  </div>
                )}
              </Card>

              {/* TERMINAL SUMMARY */}
              {hasTerminals && (
                <Card className={"max-w-full gap-4 shadow-none"}>
                  <div className="flex w-full flex-col items-center justify-between gap-8 sm:flex-row">
                    <CardHeader
                      title={`Terminal Summary`}
                      infoText={
                        "Reports on successful transaction counts and values for each terminal"
                      }
                      classNames={{
                        titleClasses:
                          "text-base md:text-lg xl:text-xl font-bold",
                        infoClasses: "text-[clamp(0.8rem,0.8vw,1rem)]",
                      }}
                    />
                    <div className="flex w-full max-w-xs gap-4">
                      <Search
                        placeholder={"Find a terminal..."}
                        className={""}
                        onChange={(e) => setTerminalQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    className={
                      "my-2 gap-4 flex max-w-full overflow-x-auto shadow-none"
                    }
                  >
                    {filteredTerminals?.length > 0 &&
                      filteredTerminals?.map((terminal) => (
                        // Array.from({ length: 8 })?.map((terminal) => (
                        <TerminalInfo
                          className={"mb-4 min-w-[300px]"}
                          key={terminal?.terminalID}
                          terminalName={terminal?.terminalName}
                          terminalID={terminal?.terminalID}
                          count={terminal?.successful_count}
                          value={terminal?.successful_value}
                        />
                      ))}
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        }

        {/* TABLE HEADER */}
        <div className="flex w-full items-center justify-between gap-8">
          <CardHeader
            title={`Transactions`}
            infoText={
              "Transactions that took place within the date range applied"
            }
            classNames={{
              titleClasses: "text-base md:text-lg xl:text-xl font-bold",
              infoClasses: "text-[clamp(0.8rem,0.8vw,1rem)]",
            }}
          />
          <div className="mb-4 flex w-full items-end justify-end gap-3">
            <Search
              className={"max-w-sm"}
              placeholder={"Search by name, or type..."}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              color={"primary"}
              onPress={() => handleFileExportToCSV()}
              startContent={<ArrowDownTrayIcon className="h-5 w-5" />}
            >
              Export
            </Button>
          </div>
        </div>

        {/* CUSTOM TABLE TO RENDER TRANSACTIONS */}
        <CustomTable
          columns={
            hasTerminals
              ? API_KEY_TERMINAL_TRANSACTION_COLUMNS
              : API_KEY_TRANSACTION_COLUMNS
          }
          rows={filteredItems || []}
          isLoading={mutation.isPending}
          isError={mutation.isError}
          removeWrapper
          // onRowAction={(key) => {}}
        />
      </Card>

      {/************************************************************************/}
    </>
  );
}
