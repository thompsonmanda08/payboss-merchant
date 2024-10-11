import { getWalletPrefunds } from '@/app/_actions/workspace-actions'
import CardHeader from '@/components/base/CardHeader'
import React from 'react'
import PrefundsTable from '../tables/PrefundsTable'

export default async function ActivePockets({ workspaceID }) {
  const activePrefunds = await getWalletPrefunds(workspaceID)
  return (
    <div>
      <CardHeader
        title={'Active Wallet Pockets'}
        infoText={
          'Every deposit is a prefund pocket and you can use the funds to make payments to your clients or employees'
        }
      />

      <PrefundsTable
        removeWrapper={true}
        rows={activePrefunds?.data?.data || []}
        emptyTitleText={'Unavailable Prefunds'}
        emptyDescriptionText={
          'You have no active prefunds available at this moment'
        }
      />
    </div>
  )
}
