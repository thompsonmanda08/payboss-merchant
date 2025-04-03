"use client";
import {
  useAccountRoles,
  useAllUsers,
  useWorkspaceRoles,
} from "./useQueryHooks";
import useAccountProfile from "./useProfileDetails";

const useAllUsersAndRoles = () => {
  const { data: allUserData, isLoading: loadingUser } = useAllUsers();
  const { data: merchantRoles } = useAccountRoles();
  const { data: workspaceRoleData } = useWorkspaceRoles();
  const { isAccountAdmin, isOwner, isApprovedUser } = useAccountProfile();

  const allUsers = allUserData?.data?.users;
  const accountRoles = merchantRoles?.data?.roles || [];
  const workspaceRoles = workspaceRoleData?.data?.roles || [];

  // PERMISSIONS
  const canCreateUsers = isAccountAdmin || isOwner;
  const isLoading = loadingUser;

  return {
    allUsers,
    accountRoles,
    workspaceRoles,
    canCreateUsers,
    isAdminOrOwner: canCreateUsers,
    isLoading,
    isApprovedUser,
  };
};

export default useAllUsersAndRoles;
