import { Suspense } from "react";

import LoadingPage from "@/app/loading";
import ManagePeople from "@/app/manage-account/users/components/manage-users";
import { getAllUsers } from "@/app/_actions/user-actions";
import { getUserAccountRoles } from "@/app/_actions/merchant-actions";
import { getUserDetails } from "@/app/_actions/config-actions";

async function UsersSettingsPage() {
  const userRolesResponse = await getUserAccountRoles();
  const roles = await userRolesResponse?.data?.roles;

  const usersResponse = await getAllUsers();
  const users = usersResponse?.data?.users;

  const session = await getUserDetails();
  const user = session?.user;
  const kyc = session?.kyc;

  const permissions = {
    isOwner: session?.user?.role?.toLowerCase() == "owner",
    isAccountAdmin: session?.user?.role?.toLowerCase() == "admin",
    isApprovedUser:
      kyc?.stageID == 4 &&
      user?.isCompleteKYC &&
      kyc?.kyc_approval_status?.toLowerCase() == "approved",
    ...session?.userPermissions,
  };

  return (
    <Suspense fallback={<LoadingPage />}>
      <ManagePeople permissions={permissions} roles={roles} users={users} />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
export default UsersSettingsPage;
