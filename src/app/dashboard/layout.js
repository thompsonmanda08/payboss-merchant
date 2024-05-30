import { SideNavBar } from '@/components'
import TopNavBar from '@/components/TopBar'

export default async function DashboardLayout({ children }) {
  return (
    <main className="relative flex h-full items-start justify-start overflow-clip bg-background pt-20 text-foreground">
      <TopNavBar />
      <SideNavBar />
      <div className="flex w-full flex-col overflow-y-auto p-8">{children}</div>
    </main>
  )
}
