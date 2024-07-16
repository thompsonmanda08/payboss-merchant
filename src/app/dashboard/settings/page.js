'use client'

import LoadingPage from '@/app/loading'
import Tabs from '@/components/base/SettingsTabs'
import {
  BusinessSettings,
  GeneralSettings,
  SecuritySettings,
  UsersSettings,
} from '@/components/containers'

import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import React, { Suspense } from 'react'

const tabs = [
  { name: 'General', href: '#', current: 0 },
  { name: 'Security', href: '#', current: 1 },
  { name: 'Business', href: '#', current: 2 },
  { name: 'Users', href: '#', current: 3 },
]

function AccountSettings() {
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <GeneralSettings key="general" />,
    <SecuritySettings key={'security'} />,
    <BusinessSettings key={'business'} />,
    <UsersSettings key={'users'} />,
  ])

  return (
    <Suspense fallback={<LoadingPage />}>
      <div>
        <div className="flex w-full flex-col rounded-xl bg-white p-5 md:p-8 lg:p-10">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Account Settings
          </h2>
          <Tabs
            tabs={tabs}
            navigateTo={navigateTo}
            currentTab={currentTabIndex}
          />
          {activeTab}
        </div>
      </div>
    </Suspense>
  )
}

export default AccountSettings
