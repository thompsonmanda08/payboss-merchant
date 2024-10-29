import SettingsSideBar from '@/components/elements/settings-sidebar'
import React from 'react'

function AccountSettingsLayout({ children }) {
  return (
    <main className="flex h-screen items-start justify-start overflow-hidden bg-[#fcfcfc] text-foreground">
      <SettingsSideBar options={'account_settings'} />
      <div className="relative flex max-h-screen w-full flex-col overflow-y-auto p-8 pt-20 lg:static lg:pt-8">
        {children}
      </div>
    </main>
  )
}

export default AccountSettingsLayout
