import { redirect } from "next/navigation";

import InfoBanner from "@/components/base/info-banner";
import DashboardAnalytics from "@/app/dashboard/components/DashboardAnalytics";
import {
  getUserDetails,
  getWorkspaceSession,
} from "@/app/_actions/config-actions";
import { getDashboardAnalytics } from "@/app/_actions/dashboard-actions";

export const revalidate = 60;
export const dynamicParams = true;

async function DashboardHome({ params }) {
  const workspaceID = (await params).workspaceID;

  if (!workspaceID) return redirect("/workspaces");

  const [session, workspaceSession, dashboardAnalytics] = await Promise.all([
    getUserDetails(),
    getWorkspaceSession(),
    getDashboardAnalytics(workspaceID),
  ]);

  return (
    <>
      {session?.user?.isCompleteKYC && (
        <InfoBanner
          buttonText="Submit Documents"
          href={"manage-account/account-verification"}
          infoText="Just one more step, please submit your business documents to aid us with the approval process"
          user={session?.user}
        />
      )}
      <DashboardAnalytics
        dashboardAnalytics={dashboardAnalytics?.data || []}
        permissions={workspaceSession?.workspacePermissions}
        workspaceID={workspaceID}
        workspaceType={workspaceSession?.workspaceType}
        workspaceWalletBalance={workspaceSession?.activeWorkspace?.balance}
      />
    </>
  );
}

export default DashboardHome;
