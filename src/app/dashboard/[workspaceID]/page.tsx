import { redirect } from 'next/navigation';

import { getWorkspaceSession } from '@/app/_actions/config-actions';
import { getDashboardAnalytics } from '@/app/_actions/dashboard-actions';
import DashboardAnalytics from '@/app/dashboard/components/DashboardAnalytics';
import { PageProps } from '@/types';

export const revalidate = 15;
export const dynamicParams = true;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Dashboard',
  description: 'Summary dashboard analytics data from the last 30 days',
};

export default async function DashboardHome({ params }: PageProps) {
  const workspaceID = (await params)?.workspaceID;

  if (!workspaceID) return redirect('/workspaces');

  const [workspaceSession, dashboardAnalytics] = await Promise.all([
    getWorkspaceSession(),
    getDashboardAnalytics(workspaceID),
  ]);

  const analytics = dashboardAnalytics?.data || [];

  return (
    <>
      <DashboardAnalytics
        dashboardAnalytics={analytics}
        workspaceID={workspaceID}
        workspaceSession={workspaceSession}
      />
    </>
  );
}
