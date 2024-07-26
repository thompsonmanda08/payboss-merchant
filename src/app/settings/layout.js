import React from 'react'
import { SettingsSideBar } from '../../components/containers/Settings/SettingsSideBar'
import { TopNavBar } from '@/components/base'

function SettingsLayout({ children }) {
  return (
    <main className="flex h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <SettingsSideBar />
      <div className="relative flex max-h-screen w-full flex-col overflow-y-auto p-8 pt-20 lg:static lg:pt-8">
        {/* <TopNavBar /> */}
        {children}
      </div>
    </main>
  )
}

export default SettingsLayout
