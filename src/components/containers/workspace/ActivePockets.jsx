import { getWalletPrefunds } from '@/app/_actions/workspace-actions'
import React from 'react'

export default async function ActivePockets() {
  const activePrefunds = await getWalletPrefunds(workspaceID)
  return (
    <div>
      {' '}
      <PrefundsTable
        removeWrapper={true}
        rows={activePrefunds?.data?.data || []}
        selectionBehavior={'multiple'}
        emptyTitleText={'Unavailable Prefunds'}
        emptyDescriptionText={
          'You have no active prefunds available at this moment'
        }
      />
    </div>
  )
}
