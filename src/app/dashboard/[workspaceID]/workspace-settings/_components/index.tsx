'use client';
import {
  Banknote as BanknotesIcon,
  Users as UserGroupIcon,
  Wallet as WalletIcon,
  Wrench as WrenchScrewdriverIcon,
  ShoppingCart as ShoppingCartIcon,
} from 'lucide-react';
import { Tabs, Tab } from '@heroui/react';
import { useEffect } from 'react';

import Card from '@/components/base/custom-card';
import useWorkspaceStore from '@/context/workspaces-store';
import useCustomTabsHook from '@/hooks/use-custom-tabs';
import { useWorkspaceInit } from '@/hooks/use-query-data';
import { WORKSPACE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

import WorkspaceDetails from '../../../../../components/elements/workspace-general-details';
import SettingsLoading from '../loading';

import ActivePockets from './active-pockets-tab';
import CheckoutConfig from './checkout-config';
import Wallet from './wallet';
import WorkspaceMembers from './workspace-members';

function WorkspaceSettings({
  workspaceID,
  selectedWorkspace,
  allUsers = [],
  workspaceMembers = [],
  workspaceRoles,
  walletHistory,
  systemRoles,
  // permissions,
}: {
  workspaceID: string;
  selectedWorkspace?: any;
  allUsers?: any[];
  workspaceMembers?: any[];
  workspaceRoles?: any[];
  walletHistory?: any[];
  systemRoles?: any[];
}) {
  const { existingUsers, setExistingUsers } = useWorkspaceStore();

  const { data: workspaceInit, isLoading } = useWorkspaceInit(workspaceID);
  // const permissions = workspaceInit?.data?.workspacePermissions;

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
        { name: 'Active Pockets', index: 2, icon: BanknotesIcon },
        { name: 'Wallet Deposits', index: 3, icon: WalletIcon },
      ]
    : // BILL PAYMENTS TAB LABEL
      isBillPaymentWorkspace
      ? [{ name: 'Wallet Deposits', index: 2, icon: WalletIcon }]
      : // COLLECTION TABS
        [{ name: 'Hosted Checkout', index: 2, icon: ShoppingCartIcon }];

  const TABS = [
    { name: 'General Settings', index: 0, icon: WrenchScrewdriverIcon },
    { name: 'Workspace Members', index: 1, icon: UserGroupIcon },
    ...DISBURSEMENT_TABS,
  ];

  // Components to be rendered for the workspace type
  const TAB_COMPONENTS =
    // * DISBURSEMENTS & HYBRID WORKSPACES
    isDisbursementOrHybrid
      ? [
          <ActivePockets
            key={'active-wallet-pocket'}
            // removeWrapper={true}
            workspaceID={workspaceID}
          />,
          <Wallet
            key={'wallet'}
            removeWrapper
            balance={activeWorkspace?.balance}
            workspaceID={workspaceID}
            workspaceName={activeWorkspace?.workspace}
            transactionData={walletHistory}
            // permissions={
            //   permissions || workspaceInit?.data?.workspacePermissions
            // }
          />,
        ]
      : // * BILL PAYMENTS WORKSPACE TABS
        isBillPaymentWorkspace
        ? [
            <Wallet
              key={'wallet'}
              removeWrapper
              balance={activeWorkspace?.balance}
              workspaceID={workspaceID}
              workspaceName={activeWorkspace?.workspace}
              transactionData={walletHistory}
              // permissions={permissions}
            />,
          ]
        : // * COLLECTION WORKSPACE TABS
          [
            <CheckoutConfig
              key={'hosted-checkout'}
              workspaceID={workspaceID}
              // permissions={permissions}
            />,
          ];

  function handleNavigation(index: number) {
    navigateTo(index);
  }

  // ******************* COMPONENT RENDERER ************************** //
  const { activeTab, navigateTo, currentTabIndex } = useCustomTabsHook([
    <WorkspaceDetails
      key={'workspace-details'}
      allUsers={allUsers}
      navigateTo={handleNavigation}
      workspaceID={workspaceID}
      workspaceName={activeWorkspace?.workspace}
      workspaceRoles={workspaceRoles}
      // permissions={permissions}
    />,
    <WorkspaceMembers
      key={'members'}
      allUsers={allUsers || []}
      workspaceID={workspaceID}
      workspaceMembers={workspaceMembers || []}
      workspaceName={activeWorkspace?.workspace}
      workspaceRoles={workspaceRoles}
      systemRoles={systemRoles}
      // permissions={permissions}
    />,

    // Provides the disbursement tabs
    ...TAB_COMPONENTS,
  ]);

  useEffect(() => {
    // UPDATE EXISTING USERS LIST
    if (workspaceMembers.length > 0 && existingUsers?.length == 0) {
      setExistingUsers(workspaceMembers);
    }
  }, []);

  return isLoading || !workspaceMembers || !workspaceType ? (
    <SettingsLoading />
  ) : (
    <div className={cn('px-3')}>
      {/* HEADER */}
      <div className={cn('mb-4')}>
        <h2 className="heading-3 !font-bold uppercase tracking-tight text-foreground">
          {activeWorkspace?.workspace || 'Workspace'}
        </h2>
        <p className="text-sm text-foreground-600">
          Workspaces provide a structured way to group and manage services,
          users, and transactions effectively.
        </p>
      </div>

      {/* CONTENT */}

      <Card className={'gap-4'}>
        <div className="flex w-full flex-row justify-between items-center relative mb-">
          <Tabs
            aria-label="Options"
            color="primary"
            radius="md"
            selectedKey={String(currentTabIndex)}
            variant="bordered"
            onSelectionChange={navigateTo as any}
          >
            {TABS.map((tab) => (
              <Tab
                key={String(tab.index)}
                title={
                  <div className="flex items-center space-x-2">
                    <tab.icon className="w-6 h-6 aspect-square" />
                    <span>{tab.name}</span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>

        <div className="flex w-full flex-grow flex-col justify-start">
          {activeTab}
        </div>
      </Card>
    </div>
  );
}

export default WorkspaceSettings;
