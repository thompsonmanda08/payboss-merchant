'use client'
import CardHeader from '@/components/base/CardHeader'
import React from 'react'
import PrefundsTable from '../tables/PrefundsTable'
import { useActivePrefunds } from '@/hooks/useQueryHooks'

export default function ActivePockets({ workspaceID }) {
  const {
    data: prefundResponse,
    isLoading,
    isFetching,
  } = useActivePrefunds(workspaceID)
  const activePrefunds = prefundResponse?.data?.data || []

  return (
    <div>
      <CardHeader
        className={'mb-4'}
        title={'Active Wallet Pockets'}
        infoText={
          'Every deposit is a prefund pocket and you can use the funds to make payments to your clients or employees'
        }
      />

      <PrefundsTable
        removeWrapper={true}
        rows={activePrefunds || []}
        emptyTitleText={'Unavailable Prefunds'}
        isLoading={isLoading || isFetching}
        emptyDescriptionText={
          'You have no active prefunds available at this moment'
        }
      />
    </div>
  )
}
