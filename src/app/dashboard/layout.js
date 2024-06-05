import { SideNavBar, TopNavBar } from '@/components/base'

export default async function DashboardLayout({ children }) {
  return (
    <main className="relative flex h-full items-start justify-start overflow-hidden bg-background text-foreground">
      <SideNavBar />
      <div className="flex max-h-screen w-full flex-col overflow-y-auto p-8">
        <TopNavBar />
        {children}
      </div>
    </main>
  )
}
