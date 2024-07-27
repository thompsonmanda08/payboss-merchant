'use client'
import { Tabs } from '@/components/base'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import React from 'react'

const TABS = [
  { name: 'All Users', href: '#', current: 0 }, // ONLY THE OWNER CAN SEE ALL USER
  { name: 'Workspace Members', href: '#', current: 1 },
  { name: 'Internal Guests', href: '#', current: 2 },
  { name: 'External Guests', href: '#', current: 3 },
]

function SecurityRolesPermissions() {
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <GeneralSettings key="general" />,
    <SecuritySettings key={'security'} />,
    <BusinessSettings key={'business'} />,
    <UsersSettings key={'all-users'} />,
    <UsersSettings key={'members'} />,
    <UsersSettings key={'external-guests'} />,
    <UsersSettings key={'internal-guests'} />,
  ])
  return (
    <div className="flex w-full flex-col rounded-xl bg-white p-5 md:p-8 lg:p-10">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Manage People
      </h2>
      <Tabs tabs={TABS} navigateTo={navigateTo} currentTab={currentTabIndex} />
      {activeTab}
    </div>
  )
}

export default SecurityRolesPermissions
