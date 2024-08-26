import { cn } from '@/lib/utils'
import { Tooltip } from '@nextui-org/react'
import React from 'react'
// import { Tooltip } from '.'

function StatusCard({
  totalTitle,
  totalText,
  totalInfo,
  viewAllRecords,
  validTitle,
  validText,
  validInfo,
  viewValidRecords,
  invalidTitle,
  invalidText,
  invalidInfo,
  viewInvalidRecords,
  tooltipText,
  Icon,
  IconColor = '#4c5cf7',
}) {
  return (
    <div className="relative mb-2 flex w-full min-w-[300px] flex-1 flex-col overflow-clip rounded-md border border-primary/30 bg-card p-5 py-8 shadow-xl shadow-slate-200/10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-foreground/60 md:text-base lg:text-lg ">
            {totalTitle}
          </p>
          <span className="my-4 mb-1 text-2xl font-bold text-primary lg:text-3xl">
            {totalText}
          </span>
          <p
            onClick={viewAllRecords}
            className=" cursor-pointer text-xs text-primary sm:text-sm"
          >
            {totalInfo}
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-foreground/60 md:text-base lg:text-lg ">
            {validTitle}
          </p>
          <span className="my-4 mb-1 text-2xl font-bold text-green-500 lg:text-3xl">
            {validText}
          </span>
          <p
            onClick={viewValidRecords}
            className=" cursor-pointer text-xs text-primary sm:text-sm"
          >
            {validInfo}
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-foreground/60 md:text-base lg:text-lg ">
            {invalidTitle}
          </p>
          <span className="my-4 mb-1 text-2xl font-bold text-red-500 lg:text-3xl">
            {invalidText}
          </span>
          <p
            onClick={viewInvalidRecords}
            className="cursor-pointer text-xs text-primary sm:text-sm"
          >
            {invalidInfo}
          </p>
        </div>
      </div>
      <div className="absolute right-2 top-2 flex items-center justify-end">
        {Icon && (
          <Tooltip
            classNames={{ content: '' }}
            color="primary"
            content={tooltipText || ''}
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
    </div>
  )
}
export default StatusCard
