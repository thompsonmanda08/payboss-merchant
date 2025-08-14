import { getUserDetails } from '@/app/_actions/config-actions';
import { getUserAccountRoles } from '@/app/_actions/merchant-actions';
import { getAllUsers } from '@/app/_actions/user-actions';
import ManagePeople from '@/app/manage-account/users/components/manage-users';

async function UsersSettingsPage() {
  const userRolesResponse = await getUserAccountRoles();
  const systemRoles = userRolesResponse?.data?.system_roles;

  const usersResponse = await getAllUsers();
  const users = usersResponse?.data?.users;

  const session = await getUserDetails();

  const permissions = {
    isOwner: session?.user?.role?.toLowerCase() == 'owner',
    isAccountAdmin: session?.user?.role?.toLowerCase() == 'admin',

    ...session?.userPermissions,
  };

  return (
    <ManagePeople permissions={permissions} roles={systemRoles} users={users} />
  );
}

export const dynamic = 'force-dynamic';

export default UsersSettingsPage;
