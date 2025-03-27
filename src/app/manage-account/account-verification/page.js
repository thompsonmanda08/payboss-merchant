import { getAuthSession, getUserDetails } from "@/app/_actions/config-actions";
import LoadingPage from "@/app/loading";
import AccountVerification from "@/app/manage-account/account-verification/components";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default async function AccountVerificationPage() {
  const session = await getUserDetails();
  const { accessToken } = await getAuthSession();

  console.log(session);

  if (!accessToken) redirect("/login");

  return (
    <Suspense fallback={<LoadingPage />}>
      <AccountVerification session={session} />
    </Suspense>
  );
}
