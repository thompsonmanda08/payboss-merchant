"use client";
import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

import { DateRangePickerField } from "@/components/ui/date-select-field";
import { WALLET_STATEMENT_REPORTS_QUERY_KEY } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { getWalletStatementReport } from "@/app/_actions/transaction-actions";
import { WalletTransactionHistory } from "@/components/containers/workspace/Wallet";
import { convertToCSVString } from "@/app/_actions/file-conversion-actions";
import Card from "@/components/base/Card";
import CardHeader from "@/components/base/CardHeader";
import Search from "@/components/ui/search";

export default function StatementReport({ workspaceID }) {
  const [dateRange, setDateRange] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const mutation = useMutation({
    mutationKey: [WALLET_STATEMENT_REPORTS_QUERY_KEY, workspaceID],
    mutationFn: (filterDates) => getReportsData(filterDates),
  });

  const statementTransactions = mutation?.data?.data?.data || [];

  // handle get wallet history asyncronously with a date mutation - date range
  async function runAsyncMutation(range) {
    if (!range?.start_date && !range?.end_date) {
      return [];
    }
    await mutation.mutateAsync(range);
  }

  async function getReportsData(range) {
    const response = await getWalletStatementReport(workspaceID, range);
    return response || [];
  }

  // Implement mannual CSV export functionality
  function handleFileExportToCSV() {
    convertToCSVString(statementTransactions, "wallet_statement");
  }

  // RESOLVE DATA FILTERING
  const hasSearchFilter = Boolean(searchQuery);
  const filteredItems = React.useMemo(() => {
    let filteredrows = [...statementTransactions];

    if (hasSearchFilter) {
      filteredrows = filteredrows.filter(
        (row) =>
          row?.ID?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          row?.amount?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          row?.type?.toLowerCase().includes(searchQuery?.toLowerCase())
      );
    }

    return filteredrows;
  }, [statementTransactions, searchQuery]);

  useEffect(() => {
    if (!mutation.data && dateRange?.start_date && dateRange?.end_date) {
      runAsyncMutation(dateRange);
      return;
    }
  }, [dateRange]);

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

      <Card className={"mb-8 w-full"}>
        <div className="flex items-center gap-2">
          <CardHeader
            title={"Wallet Statement Report"}
            classNames={{
              titleClasses: "xl:text-[clamp(1.125rem,1vw,1.75rem)] font-bold",
              infoClasses: "text-[clamp(0.8rem,0.8vw,1rem)]",
            }}
            infoText={
              "Statement transactions:" +
              ` (${dateRange ? dateRange.range : "--"})`
            }
          />

          <div className="flex w-full max-w-md gap-4">
            <Search
              placeholder={"Search by type, ID or amount..."}
              classNames={{ input: "h-10" }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <Button
              onPress={handleFileExportToCSV}
              endContent={<ArrowDownTrayIcon className="h-5 w-5" />}
            >
              Export
            </Button>
          </div>
        </div>

        <WalletTransactionHistory
          workspaceID={workspaceID}
          transactionData={filteredItems || []}
          isLoading={mutation.isPending}
        />
      </Card>
    </>
  );
}
