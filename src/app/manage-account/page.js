import Workspaces from "@/components/elements/workspaces-list";

import { getUserDetails } from "../_actions/config-actions";
import { getAllWorkspaces } from "../_actions/merchant-actions";

async function AllWorkspacesPage() {
  // Parallelize data fetching
  const [workspacesResponse, session] = await Promise.all([
    getAllWorkspaces(),
    getUserDetails(),
  ]);

  const workspaces = workspacesResponse?.data?.workspaces || [];

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col mb-4">
        <h2 className="heading-3 !font-bold tracking-tight text-foreground">
          Workspaces
        </h2>
        <p className="text-foreground-600 ">
          Workspaces provide a structured way to group and manage services,
          users, and transactions effectively.
        </p>
      </div>

      <Workspaces
        className={"m-0 border-none bg-transparent p-0 shadow-none"}
        user={session?.user}
        workspaces={workspaces}
      />
    </div>
  );
}

export default AllWorkspacesPage;
