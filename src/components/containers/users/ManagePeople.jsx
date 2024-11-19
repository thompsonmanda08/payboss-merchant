"use client";
import React from "react";
import UsersTable from "../tables/UsersTable";
import { cn } from "@/lib/utils";

function ManagePeople({ users, roles, permissions }) {
  const { isOwner, isAccountAdmin, isApprovedUser } = permissions || "";

  // ONLY ALLOW USER CREATION IS THE USER IS ADMIN/OWNER AND THE USER IS APPROVED
  const allowUserCreation = (isAccountAdmin || isOwner) && isApprovedUser;

  return (
    <div className={cn("mx-auto flex w-full max-w-7xl flex-col")}>
      <h2 className="heading-3 !font-bold tracking-tight text-foreground-900 ">
        Manage People
      </h2>
      <p className=" mb-4 text-sm text-slate-600">
        Streamline the management of user accounts and their workspaces.
      </p>
      {/* <SearchOrInviteUsers
        setSearchQuery={setSearchQuery}
        resolveAddToWorkspace={resolveAddToWorkspace}
      /> */}
      {/* <div className="flex w-full items-center justify-between gap-8">
        <Tabs
          tabs={TABS}
          className={'w-full flex-1'}
          navigateTo={navigateTo}
          currentTab={currentTabIndex}
        />
      </div> */}
      {/* <div className="mb-4"></div>
      {activeTab} */}
      <UsersTable
        key={"all-users"}
        users={users}
        accountRoles={roles}
        isUserAdmin={isOwner || isAccountAdmin}
        // tableLoading={isLoading}
        allowUserCreation={allowUserCreation}
        isApprovedUser={isApprovedUser}
      />
    </div>
  );
}

export default ManagePeople;
