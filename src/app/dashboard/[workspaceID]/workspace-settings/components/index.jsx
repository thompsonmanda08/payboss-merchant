"use client";
import { useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import {
  BanknotesIcon,
  UserGroupIcon,
  WalletIcon,
  WrenchScrewdriverIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import Tabs from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Card from "@/components/base/custom-card";
import { WORKSPACE_TYPES } from "@/lib/constants";
import useWorkspaceStore from "@/context/workspaces-store";

import CreateNewUserModal from "../../../../manage-account/users/components/new-user-modal";
import WorkspaceDetails from "../../../../../components/workspace-general-details";

import Wallet from "./wallet";
import ActivePockets from "./active-pockets-tab";
import WorkspaceMembers from "./workspace-members";
import CheckoutConfig from "./checkout-config";
import { useWorkspaceInit } from "@/hooks/useQueryHooks";
import SettingsLoading from "../loading";

function WorkspaceSettings({
  workspaceID,
  selectedWorkspace,
  allUsers,
  workspaceMembers,
  workspaceRoles,
  walletHistory,
  systemRoles,
  permissions,
}) {
  const { existingUsers, setExistingUsers } = useWorkspaceStore();

  console.log("walletHistory", walletHistory);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data: workspaceInit, isLoading } = useWorkspaceInit(workspaceID);

  const activeWorkspace =
    selectedWorkspace || workspaceInit?.data?.activeWorkspace || {};

  const workspaceType =
    activeWorkspace?.workspaceType || workspaceInit?.data?.workspaceType;

  const isDisbursementOrHybrid =
    workspaceType == WORKSPACE_TYPES[1]?.ID ||
    workspaceType == WORKSPACE_TYPES[3]?.ID;

  const isBillPaymentWorkspace = workspaceType == WORKSPACE_TYPES[2]?.ID;

  const DISBURSEMENT_TABS = isDisbursementOrHybrid
    ? // DISBURSEMENTS & HYBRID WORKSPACES TAB LABELS
      [
        { name: "Active Pockets", index: 2, icon: BanknotesIcon },
        { name: "Wallet Deposits", index: 3, icon: WalletIcon },
      ]
    : // BILL PAYMENTS TAB LABEL
      isBillPaymentWorkspace
      ? [{ name: "Wallet Deposits", index: 2, icon: WalletIcon }]
      : // COLLECTION TABS
        [{ name: "Hosted Checkout", index: 2, icon: ShoppingCartIcon }];

  const TABS = [
    { name: "General Settings", index: 0, icon: WrenchScrewdriverIcon },
    { name: "Workspace Members", index: 1, icon: UserGroupIcon },
    ...DISBURSEMENT_TABS,
  ];

  // Components to be rendered for the workspace type
  const TAB_COMPONENTS =
    // * DISBURSEMENTS & HYBRID WORKSPACES
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
            balance={activeWorkspace?.balance}
            workspaceID={workspaceID}
            workspaceName={activeWorkspace?.workspace}
            transactionData={walletHistory}
            permissions={
              permissions || workspaceInit?.data?.workspacePermissions
            }
          />,
        ]
      : // * BILL PAYMENTS WORKSPACE TABS
        isBillPaymentWorkspace
        ? [
            <Wallet
              key={"wallet"}
              removeWrapper
              balance={activeWorkspace?.balance}
              workspaceID={workspaceID}
              workspaceName={activeWorkspace?.workspace}
              transactionData={walletHistory}
              permissions={permissions}
            />,
          ]
        : // * COLLECTION WORKSPACE TABS
          [
            <CheckoutConfig
              key={"hosted-checkout"}
              workspaceID={workspaceID}
              permissions={permissions}
            />,
          ];

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
      workspaceName={activeWorkspace?.workspace}
      workspaceRoles={workspaceRoles}
      permissions={permissions}
    />,
    <WorkspaceMembers
      key={"members"}
      allUsers={allUsers || []}
      workspaceMembers={workspaceMembers || []}
      workspaceName={activeWorkspace?.workspace}
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

  return isLoading || !workspaceMembers || !workspaceType ? (
    <SettingsLoading />
  ) : (
    <div className={cn("px-3")}>
      {/* HEADER */}
      <div className={cn("mb-4")}>
        <h2 className="heading-3 !font-bold uppercase tracking-tight text-foreground">
          {activeWorkspace?.workspace}
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
        roles={systemRoles}
      />
    </div>
  );
}

export default WorkspaceSettings;
