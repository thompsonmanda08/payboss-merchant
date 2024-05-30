import { SideNavBar } from '@/components'
import TopNavBar from '@/components/TopBar'
import React from 'react'

function DashboardLayout({ Children }) {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center gap-6 overflow-clip bg-background px-4 pt-28 text-foreground sm:gap-8 md:gap-10  md:px-8 lg:px-16">
      <TopNavBar />
      <SideNavBar />
      {Children}
    </main>
  )
}

export default DashboardLayout
