'use client'
import React from 'react'
import { Card } from '.'
import {
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/solid'
import SoftBoxIcon from './SoftBoxIcon'

function Balance({ title, amount }) {
  return (
    <Card
      className={
        'w-fit min-w-[180px] max-w-xs items-center gap-4 rounded-2xl px-5'
      }
    >
      <SoftBoxIcon>
        <BuildingLibraryIcon className="h-6 w-6" />
      </SoftBoxIcon>

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
