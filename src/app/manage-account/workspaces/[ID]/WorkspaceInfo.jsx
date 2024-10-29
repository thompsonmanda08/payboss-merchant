"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import { useDisclosure } from "@nextui-org/react";
import useWorkspaces from "@/hooks/useWorkspaces";
import {
  ArrowRightStartOnRectangleIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import useNavigation from "@/hooks/useNavigation";
import useAllUsersAndRoles from "@/hooks/useAllUsersAndRoles";
import { useWorkspaceMembers } from "@/hooks/useQueryHooks";
import useWorkspaceStore from "@/context/workspaceStore";
import LoadingPage from "@/app/loading";
import { cn } from "@/lib/utils";
import UsersTable from "@/components/containers/tables/UsersTable";
import WorkspaceDetails from "@/components/containers/workspace/WorkspaceDetails";
import Wallet from "@/components/containers/workspace/Wallet";
import Link from "next/link";

const TABS = [
  { name: "General", index: 0 },
  { name: "Members", index: 1 },
  { name: "Wallet", index: 2 },
];

function WorkspaceInfo({ workspaceID }) {
  const { back } = useRouter();
  const { allWorkspaces, activeWorkspace } = useWorkspaces();
  const { isUserInWorkspace } = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const { canCreateUsers } = useAllUsersAndRoles();
  const { isEditingRole, setExistingUsers, existingUsers } =
    useWorkspaceStore();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: members } = useWorkspaceMembers(workspaceID);

  const workspaceUsers = members?.data?.users || [];

  const selectedWorkspace = allWorkspaces.find(
    (workspace) => workspace.ID === workspaceID
  );

  const userSearchResults = workspaceUsers?.filter((user) => {
    return (
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // ***** COMPONENT RENDERER ************** //
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <WorkspaceDetails
      key={"workspace-details"}
      workspaceID={workspaceID}
      workspaceName={selectedWorkspace?.workspace}
      navigateTo={handleNavigation}
    />,
    <UsersTable
      key={"members"}
      users={userSearchResults}
      workspaceID={workspaceID}
    />,
    <Wallet
      key={"wallet-details"}
      workspaceName={selectedWorkspace?.workspace}
      workspaceID={workspaceID}
      balance={selectedWorkspace?.balance}
    />,
  ]);

  function handleNavigation(index) {
    navigateTo(index);
  }

  useEffect(() => {
    // UPDATE EXISITING USERS LIST
    if (workspaceUsers && !existingUsers.length) {
      setExistingUsers(workspaceUsers);
    }
  }, []);

  const allowUserCreation =
    currentTabIndex == 1 && canCreateUsers && !isUserInWorkspace;

  return (!selectedWorkspace && !isUserInWorkspace) || !activeWorkspace ? (
    <LoadingPage />
  ) : (
    <div className={cn("px-2", { "px-3": isUserInWorkspace })}>
      {!isUserInWorkspace && (
        <div className="relative flex w-full items-center justify-between lg:-left-5">
          <Button
            aria-label="back"
            color="light"
            className={"text-primary sm:w-auto sm:max-w-fit"}
            onClick={() => back()}
            startContent={<ArrowUturnLeftIcon className="h-5 w-5" />}
          >
            Return to Workspaces
          </Button>
          <Button
            as={Link}
            href={`/dashboard/${workspaceID}`}
            aria-label="back"
            color="light"
            className={"text-primary sm:w-auto sm:max-w-fit"}
            endContent={<ArrowRightStartOnRectangleIcon className="h-5 w-5" />}
          >
            Go to Workspace Dashboard
          </Button>
        </div>
      )}
      {/* HEADER */}
      <div className={cn("mt-8")}>
        <h2 className="heading-5 !font-bold uppercase tracking-tight text-gray-900">
          {selectedWorkspace?.workspace}
        </h2>
        <p className=" text-sm text-slate-600">
          Workspaces provide a structured way to group and manage services,
          users, and transactions effectively.
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-4 px-4 lg:p-0">
        <div className="flex w-full flex-grow flex-col justify-start">
          {activeTab}
        </div>
      </div>
    </div>
  );
}

export default WorkspaceInfo;
