'use client'
import { Tabs } from '@/components/base'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import React from 'react'
import SecuritySettings from './SecuritySettings'

const TABS = [
  { name: 'All Users', href: '#', current: 0 }, // ONLY THE OWNER CAN SEE ALL USER
  { name: 'Workspace Members', href: '#', current: 1 },
  { name: 'Internal Guests', href: '#', current: 2 },
  { name: 'External Guests', href: '#', current: 3 },
]

function SecurityRolesPermissions() {
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <SecuritySettings key={'security'} />,
  ])
  return (
    <div className="flex w-full flex-col gap-5 p-5 md:p-8 lg:p-10">
      <Tabs tabs={TABS} navigateTo={navigateTo} currentTab={currentTabIndex} />
      {activeTab}
    </div>
  )
}

export default SecurityRolesPermissions
