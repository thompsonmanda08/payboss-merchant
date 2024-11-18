import React, { Suspense } from "react";
import LoadingPage from "@/app/loading";
import ManagePeople from "@/components/containers/users/ManagePeople";
import { getAllUsers } from "@/app/_actions/user-actions";
import {
  getUserAccountRoles,
  getUserDetails,
} from "@/app/_actions/config-actions";

async function UsersSettingsPage() {
  const userRoles = await getUserAccountRoles();
  const allUsers = await getAllUsers();

  const userDetails = await getUserDetails();

  // console.log(userDetails);

  const permissions = {
    isOwner: userDetails?.user?.role?.toLowerCase() == "owner",
    isAccountAdmin: userDetails?.user?.role?.toLowerCase() == "admin",
  };
  return (
    <Suspense fallback={<LoadingPage />}>
      <div>
        <ManagePeople
          users={allUsers?.data?.users}
          roles={userRoles?.data?.roles}
          permissions={permissions}
        />
      </div>
    </Suspense>
  );
}

export default UsersSettingsPage;
