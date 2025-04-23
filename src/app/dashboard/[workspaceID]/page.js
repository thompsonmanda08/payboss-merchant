import { redirect } from "next/navigation";

import InfoBanner from "@/components/base/info-banner";
import DashboardAnalytics from "@/app/dashboard/components/DashboardAnalytics";
import {
  getUserDetails,
  getWorkspaceSession,
} from "@/app/_actions/config-actions";
import { getDashboardAnalytics } from "@/app/_actions/dashboard-actions";

export const revalidate = 15;
export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = {
  title: "Dashboard",
  description: "Summary dashboard analytics data from the last 30 days",
};

async function DashboardHome({ params }) {
  const workspaceID = (await params).workspaceID;

  if (!workspaceID) return redirect("/workspaces");

  const [session, workspaceSession, dashboardAnalytics] = await Promise.all([
    getUserDetails(),
    getWorkspaceSession(),
    getDashboardAnalytics(workspaceID),
  ]);

  const isCompleteKYC = session?.user?.isCompleteKYC;
  const user = session?.user;

  const analytics = dashboardAnalytics?.data || [];
  const workspaceType = workspaceSession?.workspaceType;
  const workspaceWalletBalance = workspaceSession?.activeWorkspace?.balance;
  const permissions = workspaceSession?.workspacePermissions;

  return (
    <>
      {isCompleteKYC && (
        <InfoBanner
          buttonText="Submit Documents"
          href={"manage-account/account-verification"}
          infoText="Just one more step, please submit your business documents to aid us with the approval process"
          user={user}
        />
      )}
      <DashboardAnalytics
        dashboardAnalytics={analytics}
        permissions={permissions}
        workspaceID={workspaceID}
        workspaceType={workspaceType}
        workspaceWalletBalance={workspaceWalletBalance}
      />
    </>
  );
}

export default DashboardHome;
