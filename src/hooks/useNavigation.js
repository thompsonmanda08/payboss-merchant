"use client";
import { usePathname, useRouter } from "next/navigation";

import useWorkspaces from "./useWorkspaces";

const useNavigation = (query) => {
  const pathname = usePathname();
  const router = useRouter();

  const workspaceID = query?.workspaceID || query?.activeWorkspaceID || "";
  const activeWorkspace = query?.activeWorkspace || {};
  const workspaces = query?.workspaces || [];

  const dashboardRoute = `/dashboard/${workspaceID}`;
  const settingsPathname = `${dashboardRoute}/settings`;
  const isAccountLevelSettingsRoute = pathname.startsWith("/manage-account");

  const isUserInWorkspace =
    pathname.split("/")[1] == "dashboard" && pathname.split("/").length >= 3;

  const pathArr = pathname?.split("/");
  const currentPath =
    pathArr?.length >= 4
      ? pathArr[pathArr?.length - 1]?.replaceAll("-", " ")
      : pathArr[3]?.replaceAll("-", " ") || activeWorkspace?.workspace;

  const isProfile =
    settingsPathname == pathname ||
    (pathArr?.length == 4 &&
      pathArr?.[3]?.replaceAll("-", " ")?.toLowerCase() === "settings") ||
    pathArr?.[3]?.replaceAll("-", " ")?.toLowerCase() === "profile";

  const isSettingsPage = pathname.split("/")[3]?.toLowerCase() == "settings";
  const isUsersRoute = pathname == "/manage-account/users";

  return {
    pathname,
    router,
    pathArr,
    isProfile,
    isSettingsPage,
    currentPath,
    dashboardRoute,
    isUsersRoute,
    settingsPathname,
    isAccountLevelSettingsRoute,
    isUserInWorkspace,
    workspaceID,
    activeWorkspace,
    workspaces,
  };
};

export default useNavigation;
