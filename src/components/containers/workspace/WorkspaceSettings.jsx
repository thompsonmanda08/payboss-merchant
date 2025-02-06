"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import Tabs from "@/components/elements/tabs";
import WorkspaceDetails from "./WorkspaceDetails";
import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import CreateNewUserModal from "../users/CreateNewUserModal";
import { useDisclosure } from "@heroui/react";
import {
  BanknotesIcon,
  UserGroupIcon,
  WalletIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Wallet from "./Wallet";
import LoadingPage from "@/app/loading";
import { cn } from "@/lib/utils";
import Card from "@/components/base/Card";
import ActivePockets from "./ActivePockets";
import WorkspaceMembers from "./WorkspaceMembers";
import { WORKSPACE_TYPES } from "@/lib/constants";
import useWorkspaceStore from "@/context/workspaces-store";

function WorkspaceSettings({
  workspaceID,
  selectedWorkspace,
  allUsers,
  workspaceMembers,
  workspaceRoles,
  permissions,
}) {
  const { existingUsers, setExistingUsers } = useWorkspaceStore();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const isDisbursementOrHybrid =
    selectedWorkspace?.workspaceType == WORKSPACE_TYPES[1]?.ID ||
    selectedWorkspace?.workspaceType == WORKSPACE_TYPES[3]?.ID;

  const isBillPaymentWorkspace =
    selectedWorkspace?.workspaceType == WORKSPACE_TYPES[2]?.ID;

  const DISBURSEMENT_TABS = isDisbursementOrHybrid
    ? // DISBURSEMENTS & HYBRID WORKSPACES TAB LABELS
      [
        { name: "Active Pockets", index: 2, icon: BanknotesIcon },
        { name: "Wallet Deposits", index: 3, icon: WalletIcon },
      ]
    : // BILL PAYMENTS TAB LABEL
    isBillPaymentWorkspace
    ? [{ name: "Wallet Deposits", index: 2, icon: WalletIcon }]
    : [];

  const TABS = [
    { name: "General Settings", index: 0, icon: WrenchScrewdriverIcon },
    { name: "Workspace Members", index: 1, icon: UserGroupIcon },
    ...DISBURSEMENT_TABS,
  ];

  // Components to be rendered for the workspace type
  const TAB_COMPONENTS =
    // DISBURSEMENTS & HYBRID WORKSPACES
    isDisbursementOrHybrid
      ? [
          <ActivePockets
            key={"active-wallet-pocket"}
            workspaceID={workspaceID}
            removeWrapper={true}
          />,
          <Wallet
            key={"wallet"}
            workspaceName={selectedWorkspace?.workspace}
            workspaceID={workspaceID}
            balance={selectedWorkspace?.balance}
            removeWrapper
          />,
        ]
      : // BILL PAYMENTS SELECTED
      isBillPaymentWorkspace
      ? [
          <Wallet
            key={"wallet"}
            workspaceName={selectedWorkspace?.workspace}
            workspaceID={workspaceID}
            balance={selectedWorkspace?.balance}
            removeWrapper
          />,
        ]
      : [];

  function handleNavigation(index) {
    navigateTo(index);
  }

  // ******************* COMPONENT RENDERER ************************** //
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <WorkspaceDetails
      key={"workspace-details"}
      workspaceID={workspaceID}
      workspaceName={selectedWorkspace?.workspace}
      navigateTo={handleNavigation}
      workspaceRoles={workspaceRoles}
      allUsers={allUsers}
    />,
    <WorkspaceMembers
      key={"members"}
      workspaceMembers={workspaceMembers}
      workspaceName={selectedWorkspace?.workspace}
      workspaceID={workspaceID}
      // isLoading={isLoading}
      workspaceRoles={workspaceRoles}
      allUsers={allUsers}
    />,
    // Provides the disbursement tabs
    ...TAB_COMPONENTS,
  ]);

  const canCreateUsers = permissions?.isAdmin || permissions?.isOwner;
  const allowUserCreation = currentTabIndex == 1 && canCreateUsers;

  useEffect(() => {
    // UPDATE EXISTING USERS LIST
    if (workspaceMembers != [] && existingUsers?.length == 0) {
      setExistingUsers(workspaceMembers);
    }
  }, []);

  return !workspaceMembers ? (
    <LoadingPage />
  ) : (
    <div className={cn("px-3")}>
      {/* HEADER */}
      <div className={cn("mb-4")}>
        <h2 className="heading-3 !font-bold uppercase tracking-tight text-foreground">
          {selectedWorkspace?.workspace}
        </h2>
        <p className="text-sm text-foreground-600">
          Workspaces provide a structured way to group and manage services,
          users, and transactions effectively.
        </p>
      </div>

      {/* CONTENT */}

      <Card className={"gap-4"}>
        <div className="relative mb-2 flex items-center justify-between">
          <Tabs
            className={"md:w-full"}
            tabs={TABS}
            navigateTo={navigateTo}
            currentTab={currentTabIndex}
          />

          {allowUserCreation && (
            <Button className={"absolute right-0"} onClick={onOpen}>
              Create New User
            </Button>
          )}
        </div>

        {/* <div className="">
            {currentTabIndex == 1 && (
              <SearchOrInviteUsers setSearchQuery={setSearchQuery} />
            )}
          </div> */}

        <div className="flex w-full flex-grow flex-col justify-start">
          {activeTab}
        </div>
      </Card>

      {/* MODALS */}
      <CreateNewUserModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}

export default WorkspaceSettings;
