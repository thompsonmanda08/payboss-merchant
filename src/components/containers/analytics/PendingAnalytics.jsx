import { Card, CardHeader, Tooltip } from '@/components/base'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import React from 'react'

const PendingApprovalsItem = ({ label, icon, total }) => {
  return (
    <div className="relative flex w-full items-center justify-between">
      <div className="flex items-center gap-1">
        <div
          className={`bg-${icon?.color} mr-1 flex items-center justify-center rounded-md p-2 text-sm text-white shadow-md`}
        >
          {icon?.component}
        </div>
        <label className="text-nowrap text-xs font-medium capitalize text-slate-800">
          {label}
        </label>
      </div>
      <Tooltip
        color={icon?.color}
        content="Records awaiting admin review and action"
      >
        <Button
          size="sm"
          // variant="bordered"
          // onPress={() => {
          //   setSelectedBatch(row)
          //   setOpenBatchDetailsModal(true)
          // }}
          className={cn(
            'h-max min-h-max max-w-max cursor-pointer rounded-lg px-4 py-2 text-[13px] font-semibold capitalize text-white',
            `bg-${icon?.color}/5 text-${icon?.color}`,
            {
              'bg-red-50 text-red-500': icon?.color === 'danger',
              'bg-green-50 text-green-600': icon?.color === 'success',
              'bg-secondary/10 text-orange-600': icon?.color === 'secondary',
            },
          )}
        >
          {total} records
        </Button>
      </Tooltip>
    </div>
  )
}

function PendingApprovals({ data }) {
  return (
    <Card className={'w-2/3'}>
      <CardHeader
        title={'Approvals'}
        infoText={'Transactions that require you attention are displayed below'}
      />
      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] place-items-center gap-8">
        {data &&
          data.map((item, index) => {
            return <PendingApprovalsItem key={index} {...item} />
          })}
      </div>
    </Card>
  )
}

export default PendingApprovals
