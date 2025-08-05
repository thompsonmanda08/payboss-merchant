import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import Tooltip from "@/components/base/custom-tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function PendingApprovals({
  data,
  canApprove,
  workspaceType,
}: {
  data: any;
  canApprove: boolean;
  workspaceType: string;
}) {
  return (
    <Card className={"flex-1 self-start"}>
      <CardHeader
        infoText={
          canApprove
            ? "Transactions that require you attention are displayed below"
            : "Transactions that require approval"
        }
        title={canApprove ? "Pending Approvals" : "Initiated Transactions"}
      />
      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] place-items-center gap-8">
        {data &&
          data
            .filter((item: any) => item.workspaceType == workspaceType)
            .map((item: any, index: number) => {
              return <PendingApprovalsItem key={index} {...item} />;
            })}
      </div>
    </Card>
  );
}

const PendingApprovalsItem = ({
  label,
  icon,
  total,
}: {
  label: string;
  icon: {
    color: string;
    component: React.ReactNode;
  };
  total: number;
}) => {
  return (
    <div className="relative flex w-full items-center justify-between">
      <div className="flex items-center gap-1">
        <div
          className={`bg-${icon?.color} mr-1 flex items-center justify-center rounded-md p-2 text-sm text-white shadow-md`}
        >
          {icon?.component}
        </div>
        <label className="text-nowrap text-xs font-medium capitalize text-foreground/80">
          {label}
        </label>
      </div>
      <Tooltip content="Records awaiting admin review and action">
        <Button
          size="sm"
          // variant="bordered"
          // onPress={() => {
          //   setSelectedBatch(row)
          //   setOpenBatchDetailsModal(true)
          // }}
          className={cn(
            "h-max min-h-max max-w-max cursor-pointer rounded-lg px-4 py-2 text-[13px] font-semibold capitalize text-white",
            `bg-${icon?.color}/5 text-${icon?.color}`,
            {
              "bg-red-50 text-red-500": icon?.color === "danger",
              "bg-green-50 text-green-600": icon?.color === "success",
              "bg-secondary/10 text-orange-600": icon?.color === "secondary",
            },
          )}
        >
          {total} records
        </Button>
      </Tooltip>
    </div>
  );
};

export default PendingApprovals;
