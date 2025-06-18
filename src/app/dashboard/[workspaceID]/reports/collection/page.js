"use client";
import React, { useEffect, useState } from "react";
import {
  AdjustmentsVerticalIcon,
  ArrowDownTrayIcon,
  CalculatorIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  EyeSlashIcon,
  FunnelIcon,
  ListBulletIcon,
  PresentationChartBarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button as HeroButton,
  DropdownSection,
} from "@heroui/react";
import { useParams } from "next/navigation";

import Search from "@/components/ui/search";
import CustomTable from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { DateRangePickerField } from "@/components/ui/date-select-field";
import { QUERY_KEYS } from "@/lib/constants";
import { getCollectionsReport } from "@/app/_actions/transaction-actions";
import TotalStatsLoader from "@/app/dashboard/components/total-stats-loader";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import TotalValueStat from "@/app/dashboard/components/total-stats";
import { apiTransactionsReportToCSV } from "@/app/_actions/file-conversion-actions";
import {
  API_KEY_TERMINAL_TRANSACTION_COLUMNS,
  API_KEY_TRANSACTION_COLUMNS,
} from "@/lib/table-columns";
import { TerminalInfo } from "@/components/tables/terminal-tables";
import { useDebounce } from "@/hooks/use-debounce";
import Spinner from "@/components/ui/custom-spinner";
import SoftBoxIcon from "@/components/base/soft-box-icon";

const SERVICE_TYPES = [
  {
    name: "API Integration ",
    description: "Integrations on 3rd party aplications",
    index: 0,
    service: "api-integration", // SERVICE TYPE REQUIRED BY API ENDPOINT
    icon: AdjustmentsVerticalIcon,
  },
  {
    name: "Till Payment",
    description: "Integration on USSD and POS devices",
    index: 1,
    service: "till", // SERVICE TYPE REQUIRED BY API ENDPOINT
    icon: CalculatorIcon,
  },
  {
    name: "Hosted Checkout ",
    description: "Online E-Commerce and 3rd party checkout",
    index: 2,
    service: "checkout", // SERVICE TYPE REQUIRED BY API ENDPOINT
    icon: ShoppingCartIcon,
  },
  {
    name: "Invoice ",
    description: "Invoicing with checkout integration",
    index: 3,
    service: "invoice", // SERVICE TYPE REQUIRED BY API ENDPOINT
    icon: DocumentTextIcon,
  },
];

export default function CollectionsReports({}) {
  const params = useParams();
  const workspaceID = params.workspaceID;

  const [selectedServiceIndex, setSelectedServiceIndex] = React.useState(0);

  const SERVICE = SERVICE_TYPES?.[selectedServiceIndex]; // SELECTED SERVICE

  const [dateRange, setDateRange] = useState(); // DATE RANGE FILTER

  const [isExpanded, setIsExpanded] = useState(true); // SUMMARY EXPANDED STATE

  const [searchQuery, setSearchQuery] = useState(""); // TABLE SEARCH FILTER
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [terminalQuery, setTerminalQuery] = useState(""); // TERMINAL SEARCH FILTER
  const debouncedTerminalQuery = useDebounce(terminalQuery, 500);

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

  // FETCH COLLECTIONS REPORT DATA - ASYNC AS HOISTED INTO THE MUTATION FUNCTION
  async function getReportsData(dateRange) {
    let serviceType = SERVICE?.service;

    if (!serviceType) {
      throw new Error("No service type selected");
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
  const hasTerminals = Boolean(mutation?.data?.data?.hasTerminal || false);
  const terminalSummary = mutation?.data?.data?.terminal || [];
  const isPending = mutation?.isPending;

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
            .includes(debouncedSearchQuery?.toLowerCase()),
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
            .includes(debouncedTerminalQuery?.toLowerCase()),
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
    if (selectedServiceIndex === 0)
      apiTransactionsReportToCSV({
        objArray: transactions,
        fileName: "api_collection_transactions",
        hasTerminals,
      });

    if (selectedServiceIndex === 1) {
      apiTransactionsReportToCSV({
        objArray: transactions,
        fileName: "till_collection_transactions",
      });
    }

    if (selectedServiceIndex === 2) {
      apiTransactionsReportToCSV({
        objArray: transactions,
        fileName: "checkout_collection_transactions",
      });
    }

    if (selectedServiceIndex === 3) {
      apiTransactionsReportToCSV({
        objArray: transactions,
        fileName: "invoice_collection_transactions",
      });
    }
  }

  useEffect(() => {
    runAsyncMutation(dateRange);
  }, [selectedServiceIndex]);

  const iconClasses =
    "w-5 h-5 text-default-500 pointer-events-none flex-shrink-0";

  return (
    <>
      <div className="flex w-full items-start justify-between mb-4 -mt-4">
        <div className="relative">
          <label className={cn("pl-1 text-sm font-medium text-foreground/70")}>
            Select a Service
          </label>
          <Dropdown backdrop="blur">
            <DropdownTrigger>
              <HeroButton
                className={cn(
                  "border border-primary-300 max-h-[60px] w-full items-center justify-start p-1",
                )}
                radius="sm"
                size="lg"
                variant="light"
              >
                <SoftBoxIcon
                  className={"aspect-square h-10 w-10 p-1 rounded-[5px]"}
                >
                  {(() => {
                    const Icon = SERVICE?.icon;

                    return <Icon className="w-5 h-5" />;
                  })()}
                </SoftBoxIcon>
                <div className="flex w-full items-center justify-between text-primary">
                  <div className="flex flex-col items-start justify-start gap-0">
                    <div className="text-base font-semibold capitalize">
                      {isPending ? (
                        <div className="flex gap-2 text-sm font-bold ">
                          <Spinner size={18} />{" "}
                          {`Fetching ${SERVICE?.name} reports ...`}
                        </div>
                      ) : (
                        SERVICE?.name
                      )}
                    </div>
                    {!isPending && (
                      <span className="-mt-0.5 text-xs font-medium tracking-wide text-foreground-600">
                        Report analytics on {SERVICE?.name}
                      </span>
                    )}
                  </div>
                  <ChevronDownIcon className={cn("h-4 w-4 ease-in-out mx-4")} />
                </div>
              </HeroButton>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dropdown menu with services"
              selectionMode="single"
            >
              <DropdownSection
                // showDivider
                title="Reports by Service types"
              >
                {SERVICE_TYPES.map((service, index) => {
                  return (
                    <DropdownItem
                      key={String(service?.index || index)}
                      description={service?.description}
                      startContent={<service.icon className={iconClasses} />}
                      // shortcut="⌘N"
                      onPress={() => setSelectedServiceIndex(index)}
                    >
                      {service?.name}
                    </DropdownItem>
                  );
                })}
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
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
        {/* <div className="flex items-end justify-between">
          <Tabs
            className={"mb-2 mr-auto"}
            selectedServiceIndex={selectedServiceIndex}
            navigateTo={setCurrentTab}
            tabs={SERVICE_TYPES}
          />
        </div> */}
        <div className="flex w-full items-center justify-between gap-8">
          <CardHeader
            className={"max-w-full"}
            classNames={{
              titleClasses: "xl:text-[clamp(1.125rem,1vw,1.5rem)] font-bold",
              infoClasses: "text-[clamp(0.8rem,0.8vw,1rem)]",
            }}
            infoText={`Reports on ${SERVICE_TYPES[selectedServiceIndex]?.name} transactions that took place within the date range applied `}
            title={`${SERVICE_TYPES[selectedServiceIndex]?.name} Reports from (${
              dateRange?.range || "--"
            })`}
          />

          <div className="flex max-w-max justify-end gap-4">
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
              className="mb-4"
              initial={{ height: 0, opacity: 0 }}
            >
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
                      classNames={{
                        titleClasses:
                          "text-base md:text-lg xl:text-xl font-bold",
                        infoClasses: "text-[clamp(0.8rem,0.8vw,1rem)]",
                      }}
                      infoText={
                        "Reports on successful transaction counts and values for each terminal"
                      }
                      title={`Terminal Summary`}
                    />
                    <div className="flex w-full max-w-xs gap-4">
                      <Search
                        className={""}
                        placeholder={"Find a terminal..."}
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
                          key={terminal?.terminalID}
                          className={"mb-4 min-w-[300px]"}
                          count={terminal?.successful_count}
                          terminalID={terminal?.terminalID}
                          terminalName={terminal?.terminalName}
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
            classNames={{
              titleClasses: "text-base md:text-lg xl:text-xl font-bold",
              infoClasses: "text-[clamp(0.8rem,0.8vw,1rem)]",
            }}
            infoText={
              "Transactions that took place within the date range applied"
            }
            title={`Transactions`}
          />
          <div className="mb-4 flex w-full items-end justify-end gap-3">
            <Search
              className={"max-w-sm"}
              placeholder={"Search by name, or type..."}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              color={"primary"}
              startContent={<ArrowDownTrayIcon className="h-5 w-5" />}
              onPress={() => handleFileExportToCSV()}
            >
              Export
            </Button>
          </div>
        </div>

        {/* CUSTOM TABLE TO RENDER TRANSACTIONS */}
        <CustomTable
          removeWrapper
          columns={
            hasTerminals
              ? API_KEY_TERMINAL_TRANSACTION_COLUMNS
              : API_KEY_TRANSACTION_COLUMNS
          }
          isError={mutation.isError}
          isLoading={mutation.isPending}
          rows={filteredItems || []}
          // onRowAction={(key) => {}}
        />
      </Card>

      {/************************************************************************/}
    </>
  );
}
