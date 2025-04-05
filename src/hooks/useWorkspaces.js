"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { useSetupConfig } from "./useQueryHooks";

const useWorkspaces = (query) => {
  const pathname = usePathname();
  const [isSandboxVisible, setIsSandboxVisible] = useState(false);
  const { data: setup, isFetching, isLoading } = useSetupConfig();

  const workspaces = setup?.data?.workspaces || [];
  const workspaceTypes = setup?.data?.workspace_type || [];

  const isUserInWorkspace =
    pathname.split("/")[1] == "dashboard" && pathname.split("/").length >= 3;

  const workspaceID = isUserInWorkspace
    ? query?.workspaceID || pathname.split("/")[2]
    : query?.workspaceID || "";

  const activeWorkspace = workspaces?.find(
    (workspace) => workspace?.ID == workspaceID
  );

  const userInSandbox = activeWorkspace?.workspace?.toLowerCase() === "sandbox";

  const sandbox = workspaces?.find(
    (item) => item?.workspace?.toLowerCase() === "sandbox"
  );

  const workspaceWalletBalance =
    activeWorkspace?.balance ||
    workspaces?.find((workspace) => workspace?.ID == query?.workspaceID)
      ?.balance;

  // CHECK IF SANDBOX WORKSPACE IS UNDEFINED
  useEffect(() => {
    if (sandbox != undefined) {
      setIsSandboxVisible(true);
    }
  }, [sandbox]);

  return {
    isFetching,
    isLoading,
    activeWorkspace,
    workspaces,
    workspaceTypes,
    workspaceID: activeWorkspace?.ID,
    workspaceWalletBalance,
    isUserInWorkspace,
    sandbox,
    isSandboxVisible,
    setIsSandboxVisible,
    userInSandbox,
  };
};

export default useWorkspaces;
