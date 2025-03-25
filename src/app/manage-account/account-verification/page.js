import LoadingPage from "@/app/loading";
import AccountVerification from "@/app/manage-account/account-verification/components/AccountVerification";
import React, { Suspense } from "react";

function ApprovalPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AccountVerification />
    </Suspense>
  );
}

export default ApprovalPage;
