"use client";
import CardHeader from "@/components/base/card-header";
import { useActivePrefunds } from "@/hooks/use-query-data";
import PrefundsTable from "@/components/tables/prefunds-table";

export default function ActivePockets({ workspaceID }) {
  const {
    data: prefundResponse,
    isLoading,
    isFetching,
  } = useActivePrefunds(workspaceID);
  const activePrefunds = prefundResponse?.data?.data || [];

  return (
    <div>
      <CardHeader
        className={"mb-4"}
        infoText={
          "Every deposit is a prefund pocket and you can use the funds to make payments to your clients or employees"
        }
        title={"Active Wallet Pockets"}
      />

      <PrefundsTable
        emptyDescriptionText={
          "You have no active prefunds available at this moment"
        }
        emptyTitleText={"Unavailable Prefunds"}
        isLoading={isLoading || isFetching}
        removeWrapper={true}
        rows={activePrefunds || []}
      />
    </div>
  );
}
