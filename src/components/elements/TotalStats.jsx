import { cn } from '@/lib/utils'
import React from 'react'
import { Button } from '../ui/Button'

function TotalValueStat({ label, icon, count, value }) {
  return (
    <div className="relative flex w-full max-w-sm items-center justify-between">
      <div className="flex items-center gap-1">
        <div
          className={`bg-${icon?.color} mr-1 flex items-center justify-center rounded-md p-3 text-sm text-white shadow-md`}
        >
          {icon?.component}
        </div>
        <div className="flex flex-col">
          <span className="text-nowrap text-xs font-medium capitalize text-slate-600">
            {label}
          </span>
          <span className="text-nowrap font-medium capitalize text-slate-800">
            {count}
          </span>
        </div>
      </div>
      {value && (
        <Button
          size="sm"
          className={cn(
            'h-max min-h-max max-w-max cursor-pointer rounded-lg bg-primary-50 p-2 text-[13px] font-semibold capitalize text-primary',

            {
              'bg-red-50 text-red-500': icon?.color === 'danger',
              'bg-green-50 text-green-600': icon?.color === 'success',
              'bg-secondary/10 text-orange-600': icon?.color === 'secondary',
            },
          )}
        >
          {value}
        </Button>
      )}
    </div>
  )
}

export default TotalValueStat
