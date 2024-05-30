import { AnalyticsCard, GenerateQRCode, TransactionsTable } from "@/components";
import { ChevronRightIcon, HelpIcon } from "@/lib/icons";
import React from "react";

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-8 md:px-16 lg:px-24 pt-28 md:pt-32 bg-background text-foreground w-full gap-6 sm:gap-8 md:gap-10 overflow-clip">
      <GenerateQRCode />
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full">
        <AnalyticsCard
          title={"No. of Transactions"}
          emText={"5,680"}
          info={"Transactions Today"}
          Icon={ChevronRightIcon}
        />
        <AnalyticsCard
          title={"Total Sales"}
          emText={"ZMW 2,145.00"}
          // Icon={InformationIcon}
        />
        <AnalyticsCard
          title={"Amount Receivable"}
          emText={"ZMW 2,120.00"}
          info={"Receivable amount after service fees"}
          Icon={HelpIcon}
          IconColor="#FFDD2B"
        />
      </div>
      <div className="flex flex-col w-full min-h-2/3 mt-4">
        <div className="flex items-end justify-between w-full">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-foreground text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Recent Transactions
            </h2>
            <p>Some of your recent transactions are shown below</p>
          </div>
          <div className="flex gap-2 text-gray-500">
            <p>View all Transactions</p>
            <ChevronRightIcon className="h-6 w-6" />
          </div>
        </div>
        <TransactionsTable limit={5} />
      </div>
    </main>
  );
}

export default Home;
