import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import SideNavBar from '@/components/elements/side-navbar';
import TopNavBar from '@/components/elements/top-bar';

import { getAuthSession, getUserDetails } from '../_actions/config-actions';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const authSession = await getAuthSession();

  if (!authSession?.accessToken) redirect('/login');

  const [session] = await Promise.all([getUserDetails()]);

  return (
    <main className="flex h-screen items-start justify-start overflow-hidden bg-background text-foreground">
      <SideNavBar />
      <div className="flex max-h-screen w-full flex-col overflow-y-auto  p-5 pt-20 lg:pt-8">
        <TopNavBar user={session?.user} />
        {children}
      </div>
    </main>
  );
}
