"use client";
import React, { useState } from "react";
import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import Search from "@/components/ui/search";
import useTransactions from "@/hooks/useTransactions";
import CustomTable from "@/components/containers/tables/Table";
import { SingleTransactionColumns } from "@/components/containers/tables/SingleTransactionsTable";
import Card from "@/components/base/Card";
import CardHeader from "@/components/base/CardHeader";
import Tabs from "@/components/elements/tabs";

const transactionColumns = [
  { name: "DATE", uid: "batch_name" },
  { name: "DETAILS", uid: "number_of_records" },
  { name: "SERVICE", uid: "status" },
  { name: "DESTINATION ACCOUNT TYPE", uid: "status" },
  { name: "AMOUNT", uid: "amount" },
];

const SERVICE_TYPES = [
  {
    name: "Disbursements",
    index: 0,
  },
  {
    name: "Income",
    index: 1,
  },
  {
    name: "Expenses",
    index: 2,
  },
];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");

  const { allPaymentTransactions, isLoading } = useTransactions();
  // const [selectedKeys, setSelectedKeys] = React.useState(new Set(['']))

  const transactionRows = allPaymentTransactions?.filter((item) => {
    return (
      item?.first_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      item?.last_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      item?.amount
        ?.toString()
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase())
    );
  });

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      key={"transactions"}
      columns={SingleTransactionColumns}
      rows={transactionRows}
      isLoading={isLoading}
      rowsPerPage={10}
      // selectedKeys={selectedKeys}
      // setSelectedKeys={setSelectedKeys}
    />,
  ]);

  return (
    <>
      {/************************************************************************/}
      <Card className={"mb-8 w-full"}>
        <CardHeader
          title={"Transactions History"}
          infoText={
            "Transactions logs to keep track of your workspace activity"
          }
        />

        <div className="mt-4 flex w-full items-center justify-between gap-8 ">
          <Search
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <Tabs
            className={"my-2 mr-auto max-w-md"}
            tabs={SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />
        </div>
      </Card>
      {/*  CURRENTLY ACTIVE TABLE */}
      {activeTab}
    </>
  );
}
