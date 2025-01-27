import { cn, formatCurrency } from '@/lib/utils'
import { Chip, CircularProgress, Tooltip } from "@heroui/react"
import React from 'react'
import Card from '../base/Card'

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
  IconColor = '#4c5cf7',
  totalAmount,
  validAmount,
  invalidAmount,
}) {
  const totalPercentage = ((totalValue / totalValue) * 100).toFixed(0)
  const totalValidPercentage = ((validValue / totalValue) * 100).toFixed(0)
  const totalInvalidPercentage = ((invalidValue / totalValue) * 100).toFixed(0)
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
              onClick={viewAllRecords}
              classNames={{
                base: 'cursor-pointer',
                svg: 'w-36 h-36 drop-shadow-md ',
                indicator: 'stroke-primary',
                track: 'stroke-primary/10',
                value: 'text-2xl font-semibold text-primary',
              }}
              value={totalPercentage}
              strokeWidth={4}
              showValueLabel={true}
            />

            <Tooltip
              color="primary"
              placement="right"
              classNames={{
                content: 'text-nowrap bg-primary/10 text-primary-600',
              }}
              content={totalInfo}
              delay={1000}
              closeDelay={1000}
              // showArrow={true}
            >
              <Chip
                onClick={viewAllRecords}
                classNames={{
                  base: 'border-1 border-primary/30 mt-4 cursor-pointer',
                  content: 'text-primary text-small font-semibold',
                }}
                variant="bordered"
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
              onClick={viewValidRecords}
              classNames={{
                base: 'cursor-pointer',
                svg: 'w-36 h-36 drop-shadow-md ',
                indicator: 'stroke-green-500',
                track: 'stroke-green-500/10',
                value: 'text-2xl font-semibold text-green-500',
              }}
              value={totalValidPercentage}
              strokeWidth={4}
              showValueLabel={true}
            />

            <Tooltip
              color="success"
              placement="right"
              classNames={{
                content: 'text-nowrap bg-success/10 text-green-600',
              }}
              content={validInfo}
              delay={1000}
              closeDelay={1000}
              // showArrow={true}
            >
              <Chip
                onClick={viewValidRecords}
                classNames={{
                  base: 'border-1 border-green-500/30 mt-4 cursor-pointer',
                  content: 'text-green-500 text-small font-semibold',
                }}
                variant="bordered"
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
              onClick={viewInvalidRecords}
              classNames={{
                base: 'cursor-pointer',
                svg: 'w-36 h-36 drop-shadow-md ',
                indicator: 'stroke-red-500',
                track: 'stroke-red-500/10',
                value: 'text-2xl font-semibold text-red-500',
              }}
              value={totalInvalidPercentage}
              strokeWidth={4}
              showValueLabel={true}
            />

            <Tooltip
              color="danger"
              placement="left"
              classNames={{
                content: 'text-nowrap bg-red-500/10 text-red-600',
              }}
              content={invalidInfo}
              delay={1000}
              closeDelay={1000}
              // showArrow={true}
            >
              <Chip
                onClick={viewInvalidRecords}
                classNames={{
                  base: 'border-1 border-red-500/30 mt-4 cursor-pointer',
                  content: 'text-red-500 text-small font-semibold',
                }}
                variant="bordered"
              >
                {invalidValue} Records in total
              </Chip>
            </Tooltip>
          </div>
        </div>

        <div className="mt-2 flex w-full items-center justify-center">
          <Chip
            onClick={viewValidRecords}
            classNames={{
              base: 'p-2 py-4 cursor-pointer',
              content: 'text-green-500 text-base font-bold',
            }}
            variant="flat"
            color="success"
          >
            {formatCurrency(validAmount)}
          </Chip>
        </div>

        <div className="absolute right-2 top-2 flex items-center justify-end">
          {Icon && (
            <Tooltip
              classNames={{
                content:
                  'text-nowrap bg-primary/10 font-medium text-primary-600',
              }}
              color="primary"
              content={tooltipText || ''}
              placement="left"
            >
              <Icon
                // color={IconColor}
                className={cn(
                  'my-auto ml-4 aspect-square h-6 w-6',
                  `text-${IconColor}`,
                )}
              />
            </Tooltip>
          )}
        </div>
      </Card>
    </>
  )
}
export default StatusCard
