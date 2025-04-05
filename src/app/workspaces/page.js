import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { DefaultCover } from "@/lib/constants";
import WorkspaceHeader from "@/components/welcome-header";
import WorkspacesList from "@/components/workspaces-list";
import { cn } from "@/lib/utils";

import { getAuthSession, getUserDetails } from "../_actions/config-actions";
import LoadingPage from "../loading";

async function WorkSpacesPage() {
  const session = await getUserDetails();

  const auth = await getAuthSession();
  const { accessToken } = auth || "";

  if (!accessToken) redirect("/login");

  return (
    <Suspense fallback={<LoadingPage />}>
      <main className="flex h-full min-h-screen items-start justify-start overflow-x-clip bg-background text-foreground">
        <div className="flex h-full max-h-screen w-full flex-col">
          <section role="workspace-header">
            <div className="relative h-[280px] w-full overflow-clip rounded-b-3xl bg-gray-900">
              <WorkspaceHeader
                accountState={session?.kyc?.state}
                permissions={session?.userPermissions}
              />
              <Image
                alt="Cover Image"
                className="z-0 h-full w-full object-cover"
                height={300}
                src={DefaultCover}
                width={1024}
              />

              <div className="absolute inset-0 z-10 bg-black/30" />
            </div>
          </section>

          <section
            className={cn(
              "z-20 mx-auto mb-20 mt-[-160px] w-full max-w-[1540px] px-4 md:px-6"
            )}
            role="workspaces-list"
          >
            <WorkspacesList
              showHeader
              permissions={session?.userPermissions}
              user={session?.user || session?.userDetails}
            />
          </section>
        </div>
      </main>
    </Suspense>
  );
}

export default WorkSpacesPage;
