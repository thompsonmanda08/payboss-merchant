import { Chip, CircularProgress, Tooltip } from "@heroui/react";

import { cn, formatCurrency } from "@/lib/utils";

import Card from "./base/custom-card";

function StatusCard({
  totalTitle,
  validTitle,
  invalidTitle,
  totalValue,
  validValue,
  invalidValue,
  totalInfo,
  validInfo,
  invalidInfo,
  viewAllRecords,
  viewValidRecords,
  viewInvalidRecords,
  tooltipText,
  Icon,
  IconColor = "#4c5cf7",
  totalAmount,
  validAmount,
  invalidAmount,
}) {
  const totalPercentage = ((totalValue / totalValue) * 100).toFixed(0);
  const totalValidPercentage = ((validValue / totalValue) * 100).toFixed(0);
  const totalInvalidPercentage = ((invalidValue / totalValue) * 100).toFixed(0);

  return (
    <>
      <Card className="relative flex w-full min-w-[300px] flex-1 flex-col pt-10 shadow-none">
        <div className="flex items-center justify-between">
          {/* *************** VALID RECORDS ***************** */}
          <div className="flex max-w-fit flex-col items-center">
            <p className="text-nowraptext-sm max-w-max font-medium text-foreground/60 2xl:text-base">
              {totalTitle}
            </p>
            <CircularProgress
              classNames={{
                base: "cursor-pointer",
                svg: "w-36 h-36 drop-shadow-md ",
                indicator: "stroke-primary",
                track: "stroke-primary/10",
                value: "text-2xl font-semibold text-primary",
              }}
              showValueLabel={true}
              strokeWidth={4}
              value={totalPercentage}
              onClick={viewAllRecords}
            />

            <Tooltip
              classNames={{
                content: "text-nowrap bg-primary/10 text-primary-600",
              }}
              color="primary"
              content={totalInfo}
              delay={1000}
              placement="right"
              closeDelay={1000}
              // showArrow={true}
            >
              <Chip
                classNames={{
                  base: "border-1 border-primary/30 mt-4 cursor-pointer",
                  content: "text-primary text-small font-semibold",
                }}
                variant="bordered"
                onClick={viewAllRecords}
              >
                {totalValue} Records in total
              </Chip>
            </Tooltip>
          </div>

          {/* *************** VALID RECORDS ***************** */}
          <div className="flex max-w-fit flex-col items-center">
            <p className="text-nowraptext-sm max-w-max font-medium text-foreground/60 2xl:text-base">
              {validTitle}
            </p>

            <CircularProgress
              classNames={{
                base: "cursor-pointer",
                svg: "w-36 h-36 drop-shadow-md ",
                indicator: "stroke-green-500",
                track: "stroke-green-500/10",
                value: "text-2xl font-semibold text-green-500",
              }}
              showValueLabel={true}
              strokeWidth={4}
              value={totalValidPercentage}
              onClick={viewValidRecords}
            />

            <Tooltip
              classNames={{
                content: "text-nowrap bg-success/10 text-green-600",
              }}
              color="success"
              content={validInfo}
              delay={1000}
              placement="right"
              closeDelay={1000}
              // showArrow={true}
            >
              <Chip
                classNames={{
                  base: "border-1 border-green-500/30 mt-4 cursor-pointer",
                  content: "text-green-500 text-small font-semibold",
                }}
                variant="bordered"
                onClick={viewValidRecords}
              >
                {validValue} Records in total
              </Chip>
            </Tooltip>
          </div>

          {/* ************* INVALID RECORDS ***************** */}
          <div className="flex max-w-fit flex-col items-center">
            <p className="text-nowraptext-sm max-w-max font-medium text-foreground/60 2xl:text-base">
              {invalidTitle}
            </p>

            <CircularProgress
              classNames={{
                base: "cursor-pointer",
                svg: "w-36 h-36 drop-shadow-md ",
                indicator: "stroke-red-500",
                track: "stroke-red-500/10",
                value: "text-2xl font-semibold text-red-500",
              }}
              showValueLabel={true}
              strokeWidth={4}
              value={totalInvalidPercentage}
              onClick={viewInvalidRecords}
            />

            <Tooltip
              classNames={{
                content: "text-nowrap bg-red-500/10 text-red-600",
              }}
              color="danger"
              content={invalidInfo}
              delay={1000}
              placement="left"
              closeDelay={1000}
              // showArrow={true}
            >
              <Chip
                classNames={{
                  base: "border-1 border-red-500/30 mt-4 cursor-pointer",
                  content: "text-red-500 text-small font-semibold",
                }}
                variant="bordered"
                onClick={viewInvalidRecords}
              >
                {invalidValue} Records in total
              </Chip>
            </Tooltip>
          </div>
        </div>

        <div className="mt-2 flex w-full items-center justify-center">
          <Chip
            classNames={{
              base: "p-2 py-4 cursor-pointer",
              content: "text-green-500 text-base font-bold",
            }}
            color="success"
            variant="flat"
            onClick={viewValidRecords}
          >
            {formatCurrency(validAmount)}
          </Chip>
        </div>

        <div className="absolute right-2 top-2 flex items-center justify-end">
          {Icon && (
            <Tooltip
              classNames={{
                content:
                  "text-nowrap bg-primary/10 font-medium text-primary-600",
              }}
              color="primary"
              content={tooltipText || ""}
              placement="left"
            >
              <Icon
                // color={IconColor}
                className={cn(
                  "my-auto ml-4 aspect-square h-6 w-6",
                  `text-${IconColor}`,
                )}
              />
            </Tooltip>
          )}
        </div>
      </Card>
    </>
  );
}
export default StatusCard;
