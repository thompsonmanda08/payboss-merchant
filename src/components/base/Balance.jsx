'use client'
import React from 'react'

import SoftBoxIcon from './SoftBoxIcon'
import { WalletIcon } from '@heroicons/react/24/outline'
import { cn, formatCurrency } from '@/lib/utils'
import useWorkspaces from '@/hooks/useWorkspaces'
import Card from './Card'

function Balance({ title, amount, isLandscape }) {
  const { workspaceWalletBalance, activeWorkspace } = useWorkspaces()

  return (
    <Card
      className={cn(
        'w-fit min-w-[180px] max-w-xs items-start gap-4 rounded-2xl p-4 pr-5 shadow-none',
        { 'w-full max-w-full flex-row': isLandscape },
      )}
    >
      <SoftBoxIcon className={'-mt-1 scale-80 p-0'}>
        <WalletIcon className="h-6 w-6" />
      </SoftBoxIcon>

      <div
        className={cn('text-center', {
          'flex w-full flex-col items-start': isLandscape,
        })}
      >
        <h2 className="ml-1 text-nowrap text-xs font-semibold text-gray-500 md:text-sm">
          {title
            ? title
            : activeWorkspace?.workspace
              ? `${activeWorkspace?.workspace} Wallet Balance`
              : 'Wallet Balance'}
        </h2>

        <div
          className={cn(
            'my-2 h-px w-full bg-gradient-to-l from-transparent via-gray-200 to-transparent',
          )}
        />

        <span className="-mt-2 ml-2 max-w-max text-nowrap text-lg font-bold text-gray-800 md:text-xl">
          {formatCurrency(workspaceWalletBalance) || formatCurrency(amount)}
        </span>
      </div>
    </Card>
  )
}

export default Balance
