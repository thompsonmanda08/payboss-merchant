"use client";
import { cn } from "@/lib/utils";
import UsersTable from "@/components/tables/users-table";

function ManagePeople({ users, roles, permissions }) {
  const { isOwner, isAccountAdmin, isApprovedUser } = permissions || "";

  // ONLY ALLOW USER CREATION IS THE USER IS ADMIN/OWNER AND THE USER IS APPROVED
  const allowUserCreation = (isAccountAdmin || isOwner) && isApprovedUser;

  return (
    <div className={cn("flex w-full flex-col gap-8")}>
      <div className="flex w-full flex-col">
        <h2 className="heading-3 !font-bold tracking-tight text-foreground">
          Manage People
        </h2>
        <p className="text-sm text-foreground-600">
          Streamline the management of user accounts and their workspaces.
        </p>
      </div>
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
        accountRoles={roles}
        allowUserCreation={allowUserCreation}
        isApprovedUser={isApprovedUser}
        isUserAdmin={isOwner || isAccountAdmin}
        users={users}
      />
    </div>
  );
}

export default ManagePeople;
