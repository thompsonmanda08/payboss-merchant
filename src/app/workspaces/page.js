import React, { Suspense } from "react";
import Image from "next/image";
import { DefaultCover } from "@/lib/constants";
import WorkspaceHeader from "@/components/welcome-header";
import { getAuthSession, getUserDetails } from "../_actions/config-actions";
import LoadingPage from "../loading";
import { redirect } from "next/navigation";
import WorkspacesList from "@/components/workspaces-list";
import { cn } from "@/lib/utils";

async function WorkSpacesPage() {
  const session = await getUserDetails();
  const { user, userPermissions, kyc: merchantKYC } = session || {};

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
                permissions={userPermissions}
                accountState={merchantKYC?.state}
              />
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
            <WorkspacesList
              user={user}
              permissions={userPermissions}
              showHeader
            />
          </section>
        </div>
      </main>
    </Suspense>
  );
}

export default WorkSpacesPage;
