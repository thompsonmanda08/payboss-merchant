import React, { Suspense } from "react";
import LoadingPage from "../../loading";
import InfoBanner from "@/components/base/info-banner";
import DashboardAnalytics from "@/app/dashboard/components/DashboardAnalytics";
import {
  getAllWorkspaces,
  getUserDetails,
  getWorkspaceSession,
} from "@/app/_actions/config-actions";
import { getDashboardAnalytics } from "@/app/_actions/dashboard-actions";

export const revalidate = 60;
export const dynamicParams = true;

async function DashboardHome({ params }) {
  const workspaceID = (await params).workspaceID;

  const workspacesResponse = await getAllWorkspaces();

  const workspaces = workspacesResponse?.data?.workspaces || [];
  const activeWorkspace = await workspaces?.find(
    (workspace) => workspace?.ID == workspaceID
  );

  const workspaceSession = (await getWorkspaceSession()) || [];

  const session = await getUserDetails();
  const dashboardAnalytics = await getDashboardAnalytics(workspaceID);

  return (
    <Suspense fallback={<LoadingPage />}>
      {session?.user?.isCompleteKYC && (
        <InfoBanner
          buttonText="Submit Documents"
          infoText="Just one more step, please submit your business documents to aid us with the approval process"
          href={"manage-account/account-verification"}
          user={session?.user}
        />
      )}
      <DashboardAnalytics
        permissions={workspaceSession?.workspacePermissions}
        workspaceID={workspaceID}
        workspaceType={workspaceSession?.workspaceType}
        dashboardAnalytics={dashboardAnalytics?.data}
        workspaceWalletBalance={activeWorkspace?.balance}
      />
    </Suspense>
  );
}

export default DashboardHome;
