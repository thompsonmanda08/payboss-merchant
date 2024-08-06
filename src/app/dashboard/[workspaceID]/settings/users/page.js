import React, { Suspense } from 'react'
import LoadingPage from '@/app/loading'
import { ManagePeople } from '@/components/containers'

function UsersSettingsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ManagePeople classNames={{ wrapper: 'px-8 md:px-10 max-w-full' }} />
    </Suspense>
  )
}

export default UsersSettingsPage
