'use client'
import React from 'react'
import { Card } from '.'
import {
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/solid'
import SoftBoxIcon from './SoftBoxIcon'
import { WalletIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

function Balance({ title, amount, isLandscape }) {
  return (
    <Card
      className={cn(
        'w-fit min-w-[180px] max-w-xs items-center gap-4 rounded-2xl px-4',
        { 'w-full max-w-full flex-row gap-5': isLandscape },
      )}
    >
      <SoftBoxIcon>
        <WalletIcon className="h-6 w-6" />
      </SoftBoxIcon>

      <div
        className={cn('pt-2 text-center', {
          'flex w-full flex-col items-start px-2': isLandscape,
        })}
      >
        <h2 className="text-nowrap text-xs font-semibold text-gray-500 md:text-sm">
          {title || 'Title'}
        </h2>

        <div
          className={cn(
            'my-4 h-px w-full bg-gradient-to-l from-transparent via-gray-200 to-transparent',
            { 'my-1 max-w-[160px] from-transparent to-white': isLandscape },
          )}
        />

        <span className="text-nowrap text-lg font-bold text-gray-800 md:text-xl">
          {amount || 'Amount'}
        </span>
      </div>
    </Card>
  )
}

export default Balance
