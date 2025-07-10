"use client";
import { usePathname } from "next/navigation";

import { useAssignedWorkspaces } from "./use-query-data";

const useWorkspaces = (query) => {
  const pathname = usePathname();

  // const { data: setup } = useSetupConfig();
  const setup = {};

  const {
    data: workspacesResponse,
    isLoading,
    isFetching,
  } = useAssignedWorkspaces();

  const workspaces = workspacesResponse?.data || [];
  const workspaceTypes = setup?.data?.workspace_type || [];

  const isUserInWorkspace =
    pathname.split("/")[1] == "dashboard" && pathname.split("/").length >= 3;

  const workspaceID = isUserInWorkspace
    ? query?.workspaceID || pathname.split("/")[2]
    : query?.workspaceID || "";

  const activeWorkspace = workspaces?.find(
    (workspace) => workspace?.ID == workspaceID
  );

  const workspaceWalletBalance =
    activeWorkspace?.balance ||
    workspaces?.find((workspace) => workspace?.ID == query?.workspaceID)
      ?.balance;

  return {
    isFetching,
    isLoading,
    activeWorkspace,
    workspaces,
    workspaceTypes,
    workspaceID: activeWorkspace?.ID,
    workspaceWalletBalance,
    isUserInWorkspace,
  };
};

export default useWorkspaces;
