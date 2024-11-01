import LoadingPage from "@/app/loading";
import Workspaces from "@/components/containers/workspace/WorkspacesList";
import React, { Suspense } from "react";
import {
  getAllWorkspaces,
  getAuthSession,
  getUserDetails,
} from "../_actions/config-actions";
import { redirect } from "next/navigation";

async function AllWorkspacesPage() {
  const session = await getUserDetails();
  const authSession = await getAuthSession();

  const workspacesResponse = await getAllWorkspaces();
  const workspaces = workspacesResponse?.data?.workspaces || [];

  if (!authSession?.accessToken) redirect("/login");

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col mb-4">
          <h2 className="heading-3 !font-bold tracking-tight text-foreground">
            Workspaces
          </h2>
          <p className="text-foreground-500 tracking-wide">
            Workspaces provide a structured way to group and manage services,
            users, and transactions effectively.
          </p>
        </div>

        <Workspaces
          user={session?.user}
          workspaces={workspaces}
          className={"m-0 border-none bg-transparent p-0 shadow-none"}
        />
      </div>
    </Suspense>
  );
}

export default AllWorkspacesPage;
