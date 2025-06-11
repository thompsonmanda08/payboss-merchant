import ManagePeople from "@/app/manage-account/users/components/manage-users";
import { getAllUsers } from "@/app/_actions/user-actions";
import { getUserAccountRoles } from "@/app/_actions/merchant-actions";
import { getUserDetails } from "@/app/_actions/config-actions";

async function UsersSettingsPage() {
  const userRolesResponse = await getUserAccountRoles();
  const roles = await userRolesResponse?.data?.system_roles;

  const usersResponse = await getAllUsers();
  const users = usersResponse?.data?.users;

  const session = await getUserDetails();
  // const user = session?.user;
  const kyc = session?.kyc;

  const permissions = {
    isOwner: session?.user?.role?.toLowerCase() == "owner",
    isAccountAdmin: session?.user?.role?.toLowerCase() == "admin",
    isApprovedUser: kyc?.stage_id == 3,
    ...session?.userPermissions,
  };

  return <ManagePeople permissions={permissions} roles={roles} users={users} />;
}

export const dynamic = "force-dynamic";

export default UsersSettingsPage;
