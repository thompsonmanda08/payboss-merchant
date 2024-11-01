import React, { Suspense } from "react";
import Image from "next/image";
import { DefaultCover } from "@/lib/constants";
import WorkspaceHeader from "@/components/containers/workspace/WorkspaceListHeader";
import { getAuthSession, getUserDetails } from "../_actions/config-actions";
import LoadingPage from "../loading";
import Workspaces from "@/components/containers/workspace/WorkspacesList";

async function WorkSpacesPage() {
  const session = await getUserDetails();
  const isLoggedin = await getAuthSession();
  const { user } = session || null;

  console.log(session);

  if (!isLoggedin?.accessToken) redirect("/login");

  return (
    <Suspense fallback={<LoadingPage />}>
      <main className="flex h-full min-h-screen items-start justify-start overflow-x-clip bg-background text-foreground">
        <div className="flex h-full max-h-screen w-full flex-col">
          <section role="workspace-header">
            <div className="relative h-[380px] w-full overflow-clip rounded-b-3xl bg-gray-900">
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
            className="z-20 mx-auto -mt-40 mb-20 w-full max-w-[1440px] px-5 md:px-10"
          >
            <Workspaces user={user} showHeader />
          </section>
        </div>
      </main>
    </Suspense>
  );
}

export default WorkSpacesPage;
