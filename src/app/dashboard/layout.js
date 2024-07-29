import { SideNavBar, TopNavBar } from '@/components/base'
import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  return (
    <main className="flex h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <SideNavBar />
      <div className="relative flex max-h-screen w-full flex-col overflow-y-auto p-8 pt-20 lg:static lg:pt-8">
        <TopNavBar />
        {children}
      </div>
    </main>
  )
}
