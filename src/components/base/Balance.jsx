'use client'
import React from 'react'
import { Card } from '.'
import {
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/solid'
import { SoftBoxIcon } from '@/app/dashboard/components'

function Balance({ title, amount }) {
  return (
    <Card
      className={
        'w-fit min-w-[180px] max-w-xs items-center gap-4 rounded-2xl px-5'
      }
    >
      <div className="grid aspect-square h-12 w-12 place-items-center rounded-lg bg-gradient-to-tr from-primary to-blue-300 p-3 text-white">
        <BuildingLibraryIcon className="h-6 w-6" />
      </div>

      <div className="pt-2 text-center">
        <h2 className="text-nowrap text-xs font-semibold text-gray-500 md:text-sm">
          {title || 'Title'}
        </h2>
        {/* <p className="text-xs leading-8 text-gray-700 sm:text-[13px]">
          Some info for account
        </p> */}

        <div className="my-4 h-px w-full bg-gradient-to-l from-transparent via-gray-200 to-transparent"></div>
        <span className="text-nowrap text-lg font-bold text-gray-800 md:text-xl">
          {amount || 'Amount'}
        </span>
      </div>
    </Card>
  )
}

export default Balance
