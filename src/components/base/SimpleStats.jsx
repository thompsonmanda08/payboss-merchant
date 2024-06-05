import React from 'react'
import { Card } from '.'
import { BuildingStorefrontIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

function SimpleStats({ title, figure, figurePercentage, isGood, isBad }) {
  return (
    <Card
      className={
        'min-w-[300px] flex-row items-center justify-between rounded-2xl'
      }
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-nowrap text-xs font-semibold text-gray-500 md:text-sm">
          {title || 'Title'}
        </h2>
        <p className="text-nowrap text-lg font-bold text-slate-800 md:text-xl lg:text-2xl">
          {figure || '100,000'}
          {figurePercentage && (
            <span
              className={cn(
                'ml-2 text-xs font-semibold text-primary md:text-sm',
                {
                  'text-green-500': isGood,
                  'text-rose-600': isBad,
                },
              )}
            >
              {figurePercentage}
            </span>
          )}
        </p>
      </div>

      <div className="grid aspect-square h-14 w-14 place-items-center rounded-lg bg-gradient-to-tr from-primary to-blue-300 p-3 text-white">
        <BuildingStorefrontIcon className="h-6 w-6" />
      </div>
    </Card>
  )
}

export default SimpleStats
