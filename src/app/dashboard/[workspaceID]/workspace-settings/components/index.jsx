"use client";
import { useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import {
  BanknotesIcon,
  UserGroupIcon,
  WalletIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import Tabs from "@/components/tabs";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/app/loading";
import { cn } from "@/lib/utils";
import Card from "@/components/base/custom-card";
import { WORKSPACE_TYPES } from "@/lib/constants";
import useWorkspaceStore from "@/context/workspaces-store";

import CreateNewUserModal from "../../../../manage-account/users/components/new-user-modal";
import WorkspaceDetails from "../../../../../components/workspace-general-details";

import Wallet from "./wallet";
import ActivePockets from "./active-pockets-tab";
import WorkspaceMembers from "./workspace-members";

function WorkspaceSettings({
  workspaceID,
  selectedWorkspace,
  allUsers,
  workspaceMembers,
  workspaceRoles,
  systemRoles,
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
            removeWrapper={true}
            workspaceID={workspaceID}
          />,
          <Wallet
            key={"wallet"}
            removeWrapper
            balance={selectedWorkspace?.balance}
            workspaceID={workspaceID}
            workspaceName={selectedWorkspace?.workspace}
          />,
        ]
      : // BILL PAYMENTS SELECTED
        isBillPaymentWorkspace
        ? [
            <Wallet
              key={"wallet"}
              removeWrapper
              balance={selectedWorkspace?.balance}
              workspaceID={workspaceID}
              workspaceName={selectedWorkspace?.workspace}
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
      allUsers={allUsers}
      navigateTo={handleNavigation}
      workspaceID={workspaceID}
      workspaceName={selectedWorkspace?.workspace}
      workspaceRoles={workspaceRoles}
      permissions={permissions}
    />,
    <WorkspaceMembers
      key={"members"}
      allUsers={allUsers || []}
      workspaceMembers={workspaceMembers || []}
      workspaceName={selectedWorkspace?.workspace}
      workspaceID={workspaceID}
      workspaceRoles={workspaceRoles}
      systemRoles={systemRoles}
      permissions={permissions}
    />,
    // Provides the disbursement tabs
    ...TAB_COMPONENTS,
  ]);

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
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
            tabs={TABS}
          />

          {currentTabIndex == 1 && permissions?.create && (
            <Button className={"absolute right-0"} onClick={onOpen}>
              Create New User
            </Button>
          )}
        </div>

        <div className="flex w-full flex-grow flex-col justify-start">
          {activeTab}
        </div>
      </Card>

      {/* MODALS */}
      <CreateNewUserModal
        isOpen={isOpen}
        workspaceID={workspaceID}
        onClose={onClose}
        onOpenChange={onOpenChange}
        roles={workspaceRoles}
      />
    </div>
  );
}

export default WorkspaceSettings;
