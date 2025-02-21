import React, { Suspense } from "react";
import Image from "next/image";
import { DefaultCover } from "@/lib/constants";
import WorkspaceHeader from "@/components/containers/workspace/WorkspaceListHeader";
import { getAuthSession, getUserDetails } from "../_actions/config-actions";
import LoadingPage from "../loading";
import { redirect } from "next/navigation";
import WorkspacesList from "@/components/containers/workspace/WorkspacesList";
import { cn } from "@/lib/utils";

async function WorkSpacesPage() {
  const session = await getUserDetails();
  const { user } = session || {};
  const authSession = await getAuthSession();

  if (!authSession?.accessToken) redirect("/login");

  return (
    <Suspense fallback={<LoadingPage />}>
      <main className="flex h-full min-h-screen items-start justify-start overflow-x-clip bg-background text-foreground">
        <div className="flex h-full max-h-screen w-full flex-col">
          <section role="workspace-header">
            <div className="relative h-[280px] w-full overflow-clip rounded-b-3xl bg-gray-900">
              <WorkspaceHeader user={user} />
              <Image
                className="z-0 h-full w-full object-cover"
                src={DefaultCover}
                alt="Cover Image"
                width={1024}
                height={300}
              />

              <div className="absolute inset-0 z-10 bg-black/30"></div>
            </div>
          </section>

          <section
            role="workspaces-list"
            className={cn(
              "z-20 mx-auto mb-20 mt-[-160px] w-full max-w-[1540px] px-4 md:px-6"
            )}
          >
            <WorkspacesList user={user} showHeader />
          </section>
        </div>
      </main>
    </Suspense>
  );
}

export default WorkSpacesPage;
