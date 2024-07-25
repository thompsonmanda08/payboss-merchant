import React, { Suspense } from 'react'
import LoadingPage from '@/app/loading'
import { ManagePeople } from '@/components/containers'

function UsersSettingsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <div>
        <ManagePeople />
      </div>
    </Suspense>
  )
}

export default UsersSettingsPage
