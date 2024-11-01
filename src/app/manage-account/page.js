import LoadingPage from "@/app/loading";
import Workspaces from "@/components/containers/workspace/WorkspacesList";
import React, { Suspense } from "react";
import { getUserDetails } from "../_actions/config-actions";

async function AllWorkspacesPage() {
  const session = await getUserDetails();
  console.log(session?.user);

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div>
          <h2 className="heading-3 !font-bold tracking-tight text-foreground">
            Workspaces
          </h2>
          <p className=" text-sm text-slate-600">
            Workspaces provide a structured way to group and manage services,
            users, and transactions effectively.
          </p>
        </div>

        <Workspaces
          user={session?.user}
          className={"m-0 border-none bg-transparent p-0 shadow-none"}
        />
      </div>
    </Suspense>
  );
}

export default AllWorkspacesPage;
