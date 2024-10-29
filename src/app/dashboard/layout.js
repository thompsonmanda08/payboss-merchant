import SideNavBar from '@/components/elements/side-navbar'
import {
  getAuthSession,
  getUserDetails,
  getWorkspaceSession,
} from '../_actions/config-actions'
import TopNavBar from '@/components/elements/top-bar'

export default async function DashboardLayout({ children }) {
  const auth = await getAuthSession()
  const session = await getUserDetails()
  const workspaceSession = (await getWorkspaceSession()) || []

  if (!auth) {
    redirect('/login')
  }

  return (
    <main className="flex h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <SideNavBar workspaceSession={workspaceSession} />
      <div className="flex max-h-screen w-full flex-col overflow-y-auto  p-5 pt-20 lg:pt-8">
        <TopNavBar user={session?.user} />
        {children}
      </div>
    </main>
  )
}
