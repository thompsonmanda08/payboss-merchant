import React, { Suspense } from "react";
import LoadingPage from "@/app/loading";

function SecurityPermissions() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="mx-auto flex w-full  flex-col gap-8 px-8 md:px-10 ">
        <div>
          <h2 className="heading-3 !font-bold tracking-tight text-gray-900 ">
            Security & Permissions
          </h2>
          <p className=" text-sm text-slate-600">
            Configure access controls, two-factor authentication, and other
            security measures for your workspace.
          </p>
        </div>
      </div>
    </Suspense>
  );
}

export default SecurityPermissions;
