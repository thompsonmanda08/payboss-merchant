"use client";
import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import React, { useEffect } from "react";
import BusinessAccountDetails from "./BusinessAccountDetails";
import DocumentAttachments from "./DocumentAttachments";
import ProgressStageTracker from "./ProgressStageTracker";
import useConfigOptions from "@/hooks/useConfigOptions";
import useAccountProfile from "@/hooks/useProfileDetails";
import DocumentsViewer from "./DocumentsViewer";
import Tabs from "@/components/tabs";

function AccountVerification() {
  const {
    user,
    businessDetails,
    businessDocs,
    allowUserToSubmitKYC,
    KYCStageID,
    KYCApprovalStatus,
  } = useAccountProfile();
  const { companyTypes, banks, currencies } = useConfigOptions();

  // ************* TABS RENDERER ************** //
  const TABS = [
    { name: "Verification Status", href: "#", index: 0 },
    { name: "Business Details", href: "#", index: 1 },
    { name: "Documentation", href: "#", index: 2 },
  ];

  const DOCUMENT_COMPONENTS = allowUserToSubmitKYC ? (
    <DocumentAttachments
      key={"documents"}
      businessDocs={businessDocs}
      navigateToPage={navigateToPage}
    />
  ) : (
    <DocumentsViewer
      key={"documents"}
      businessDocs={businessDocs}
      navigateToPage={navigateToPage}
    />
  );

  const RENDER_COMPONENTS = [
    <ProgressStageTracker key={"verification-status"} />,
    <BusinessAccountDetails
      key={"business-details"}
      user={user}
      businessDetails={businessDetails}
      companyTypes={companyTypes}
      banks={banks}
      currencies={currencies}
      navigateToPage={navigateToPage}
    />,
    DOCUMENT_COMPONENTS,
  ];

  // ************* COMPONENT RENDERER ************** //
  const { activeTab, navigateTo, currentTabIndex } =
    useCustomTabsHook(RENDER_COMPONENTS);

  function navigateToPage(index) {
    navigateTo(index);
  }

  useEffect(() => {}, [KYCStageID, KYCApprovalStatus]);

  return (
    <div className="flex w-full flex-col">
      <section
        role="account-verification-header"
        className="flex w-full flex-col"
      >
        <h2 className="heading-3 !font-bold tracking-tight text-foreground ">
          Account Verification
        </h2>
        <p className="text-sm text-foreground-600">
          Initiate your KYC, business details, and document verification process
          from this section
        </p>

        <div className="flex items-center justify-between gap-8">
          <Tabs
            className={"my-4"}
            tabs={TABS}
            navigateTo={navigateTo}
            currentTab={currentTabIndex}
          />
        </div>
        <div className="mb-4"></div>
      </section>

      <section
        role="profile-content"
        className="grid w-full place-items-center gap-4 "
      >
        {activeTab}
      </section>
    </div>
  );
}

export default AccountVerification;
