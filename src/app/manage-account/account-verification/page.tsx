"use client";
import { useEffect, useState } from "react";
import {
  DocumentIcon,
  BuildingOffice2Icon,
  CreditCardIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { PencilIcon } from "@heroicons/react/20/solid";
import {
  CheckBadgeIcon,
  DocumentCheckIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";

import useConfigOptions from "@/hooks/use-config-options";
import useAccountProfile from "@/hooks/use-profile-info";
import { cn } from "@/lib/utils";
import useKYCInfo from "@/hooks/use-kyc-info";

import DocumentAttachments from "./components/kyc-document-attachments";
import {
  BusinessInformationForm,
  BankAccountForm,
} from "./components/business-account-details";
import ComplianceSummary from "./components/compliance-summary";
import TermsAndAgreement from "./components/contract";
import ProgressStageTracker from "./components/account-verification-tracker";
import AccountVerificationLoading from "./loading";

const SIDEBAR_ITEMS = [
  {
    name: "KYC Stages",
    id: "start",
    status: "inProgress",
    Icon: FlagIcon,
  },
  {
    name: "Business Details",
    id: "business",
    status: "pending",
    Icon: BuildingOffice2Icon,
    description: "Provide your business details.",
  },
  {
    name: "Bank Account",
    id: "bankAccount",
    status: "pending",
    Icon: CreditCardIcon,
    description: "Your business bank account for transactions.",
  },
  {
    name: "Documents",
    id: "documents",
    status: "pending",
    Icon: DocumentIcon,
    description: "Upload and verify required documents.",
  },
  {
    name: "Contract & Agreement",
    id: "contract",
    status: "pending",
    Icon: DocumentCheckIcon,
    description: "Review and accept the terms and conditions.",
  },
  {
    name: "Summary",
    id: "summary",
    status: "pending",
    Icon: ClipboardDocumentCheckIcon,
  },
];

function AccountVerification({}) {
  const { user, isOwner, isAccountAdmin } = useAccountProfile();

  const {
    companyTypes,
    banks,
    currencies,
    provinces,
    isLoading: loadingConfigOptions,
  } = useConfigOptions();

  const {
    KYCStageID,
    merchantID,
    documents,
    refDocsExist,
    businessDetails,
    isLoading: loadingKYCInfo,
    isCompleteKYC,
    allowUserToSubmitKYC,
  } = useKYCInfo();

  const [sections, setSections] = useState(SIDEBAR_ITEMS);

  const [activeSection, setActiveSection] = useState(
    SIDEBAR_ITEMS.find((item) => item.status === "inProgress")?.id ||
      SIDEBAR_ITEMS[0].id,
  );

  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // UPDATE SECTION STATUS BASED ON THE KYC STAGE ID AND BUSINESS DETAILS
  useEffect(() => {
    setSections((currentSections) => {
      let hasChanged = false;
      let newSections = [...currentSections];

      // FILTER OUT CONTRACTS IN KYC NOT COMPLETED
      if (KYCStageID < 1) {
        newSections = newSections.filter(
          (section) => section.id !== "contract",
        );
      }

      const updateStatus = (sectionId: string, status: string) => {
        const sectionIndex = newSections.findIndex((s) => s.id === sectionId);

        if (
          sectionIndex !== -1 &&
          newSections[sectionIndex].status !== status
        ) {
          // Create a new array with the updated section
          newSections = [
            ...newSections.slice(0, sectionIndex),
            { ...newSections[sectionIndex], status },
            ...newSections.slice(sectionIndex + 1),
          ];
          hasChanged = true;
        }
      };

      if (KYCStageID > 2) {
        updateStatus("start", "completed");
      }

      if (!allowUserToSubmitKYC) {
        updateStatus("summary", "completed");
      }

      // IF ALL BUSINESS DETAILS FIELDS ARE PROVIDED IN THE BUSINESS DETAILS OBJECT
      if (
        // BUSINESS PROFILE FIELDS
        businessDetails.name &&
        businessDetails.companytypeID &&
        businessDetails.tpin &&
        businessDetails.date_of_incorporation &&
        // CONTACT INFORMATION FIELDS
        businessDetails.contact &&
        businessDetails.company_email &&
        businessDetails.website &&
        // BUSINESS ADDRESS FIELDS
        businessDetails.cityID &&
        businessDetails.provinceID &&
        businessDetails.physical_address
      ) {
        updateStatus("business", "completed");
      }

      // IF ALL BANK ACCOUNT FIELDS ARE PROVIDED IN THE BUSINESS DETAILS OBJECT
      if (
        businessDetails.bankID &&
        businessDetails.branch_name &&
        businessDetails.account_name &&
        businessDetails.account_number &&
        businessDetails.currencyID
      ) {
        updateStatus("bankAccount", "completed");
      }

      // IF DOCUMENTS OBJECT HAS BEEN UPDATED AND HAS ALL ENTRY KEYS
      if (
        Boolean(
          documents.company_profile_url &&
            documents.cert_of_incorporation_url &&
            documents.share_holder_url &&
            documents.tax_clearance_certificate_url &&
            documents.articles_of_association_url &&
            documents.organisation_structure_url &&
            documents.director_nrc_url &&
            documents.passport_photos_url &&
            documents.proof_of_address_url &&
            documents.bank_statement_url,
        )
      ) {
        updateStatus("documents", "completed");
      }

      if (KYCStageID == 3 && isCompleteKYC && documents.signed_contract) {
        updateStatus("contract", "completed");
      }

      return hasChanged ? newSections : currentSections;
    });
    // IF THE BUSINESS DETAILS / DOCUMENTS / KYC STATE HAS BEEN UPDATED, UPDATE THE SECTIONS STATE WITH THE UPDATED SECTIONS
  }, [KYCStageID, businessDetails, documents]);

  const renderActiveComponent = () => {
    switch (activeSection) {
      case "start":
        return (
          <ProgressStageTracker
            onCompletionNavigateTo={() =>
              navigateToSection(
                sections.find((s) => s.status === "pending")?.id || "business",
              )
            }
          />
        );
      case "business":
        return (
          <BusinessInformationForm
            businessDetails={businessDetails}
            companyTypes={companyTypes}
            provinces={provinces}
            // user={user}
            onCompletionNavigateTo={(targetSectionId) =>
              navigateToSection(targetSectionId || "bankAccount")
            }
          />
        );
      case "bankAccount":
        return (
          <BankAccountForm
            banks={banks}
            businessDetails={businessDetails}
            currencies={currencies}
            onCompletionNavigateTo={(targetSectionId?: string) =>
              navigateToSection(targetSectionId || "documents")
            }
          />
        );

      case "documents":
        return (
          <DocumentAttachments
            key={"documents"}
            allowUserToSubmitKYC={allowUserToSubmitKYC}
            documents={documents}
            isAdminOrOwner={isOwner || isAccountAdmin}
            merchantID={merchantID}
            refDocsExist={refDocsExist}
            onCompletionNavigateTo={(targetSectionId?: string) =>
              navigateToSection(targetSectionId || "contract")
            }
          />
        );
      case "contract":
        return (
          <TermsAndAgreement
            isAdminOrOwner={isOwner || isAccountAdmin}
            onCompletionNavigateTo={(targetSectionId?: string) =>
              navigateToSection(targetSectionId || "summary")
            }
          />
        );
      case "summary":
        return (
          <ComplianceSummary
            navigateToSection={navigateToSection}
            sections={sections}
          />
        );
      default:
        return (
          <ProgressStageTracker
            onCompletionNavigateTo={(targetSectionId?: string) =>
              navigateToSection(targetSectionId || "business")
            }
          />
        );
    }
  };

  if (loadingConfigOptions || loadingKYCInfo) {
    return <AccountVerificationLoading />;
  }

  return (
    <div className="flex w-full flex-col">
      <section
        className="flex w-full flex-col mb-6 px-4 md:px-0"
        role="account-verification-header"
      >
        <h2 className="heading-3 !font-bold tracking-tight text-foreground ">
          Account Verification
        </h2>
        <p className="text-sm text-foreground-600">
          Complete all sections to get your account activated.
        </p>
      </section>

      <div className="flex w-full flex-col lg:flex-row gap-4 xl:gap-x-8 px-4 md:px-0">
        <aside className="w-full lg:w-72">
          <nav aria-label="Stepper" className="">
            <ol
              className="flex items-center lg:flex-col lg:items-stretch w-full flex-1"
              role="list"
            >
              {sections
                .flatMap((item, index) => {
                  const isActive = activeSection === item.id;
                  const isCompleted = item.status === "completed";

                  const step = (
                    <li
                      key={item.id}
                      className="relative shrink-0 flex-1 lg:pb-0 "
                    >
                      {/* Vertical Line between steps for lg screens */}
                      {index !== sections.length - 1 && (
                        <div
                          aria-hidden="true"
                          className={cn(
                            "hidden lg:block absolute left-[40px] transition-all duration-300 ease-in-out top-8 -ml-px mt-0.5 h-full w-0.5 bg-primary-300 dark:bg-primary-600",
                            {
                              "bg-primary-600 dark:bg-primary-400": isCompleted,
                            },
                          )}
                        />
                      )}

                      {/* Step button */}
                      <button
                        aria-current={isActive ? "step" : undefined}
                        className={cn(
                          "group relative flex w-full items-center rounded-md p-2 focus:outline-none lg:items-start lg:py-3 lg:my-4 transition-all duration-300 ease-in-out",
                          "flex-col lg:flex-row outline-none border-none",
                          {
                            "bg-blue-50 dark:bg-gray-800 min-w-40 lg:min-w-auto":
                              isActive,
                            "hover:bg-gray-50 dark:hover:bg-gray-800":
                              !isActive,
                          },
                        )}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <span className="flex items-center lg:mx-4">
                          <span
                            className={cn(
                              "relative z-10 flex aspect-square w-9 items-center justify-center rounded-full bg-primary-100 transition-all duration-300 group-hover:bg-primary-400 dark:bg-gray-700 dark:group-hover:bg-primary-600",
                              {
                                "bg-primary-600 text-white dark:bg-primary-400":
                                  isActive || isCompleted,
                              },
                            )}
                          >
                            {isCompleted ? (
                              <CheckBadgeIcon className="h-5 w-5 text-white" />
                            ) : isActive ? (
                              <PencilIcon className="h-4 w-4 text-white" />
                            ) : (
                              <item.Icon className="h-4 w-4 text-primary-500 group-hover:text-white dark:group-hover:text-white" />
                            )}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-2 flex flex-col items-center lg:mt-0 lg:items-start",
                            { "hidden lg:flex": !isActive },
                          )}
                        >
                          <span
                            className={cn(
                              "text-sm font-medium text-gray-600 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200",
                              {
                                "text-primary-700 dark:text-primary-300":
                                  isActive || isCompleted,
                              },
                            )}
                          >
                            {item.name}
                          </span>
                          <span
                            className={cn(
                              "text-xs text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400",
                              {
                                "text-primary-500 dark:text-primary-400":
                                  isActive || isCompleted,
                              },
                            )}
                          >
                            {isCompleted
                              ? "Completed"
                              : isActive
                                ? "In Progress"
                                : "Pending"}
                          </span>
                        </span>
                      </button>
                    </li>
                  );

                  if (index === sections.length - 1) {
                    return [step];
                  }

                  const connector = (
                    <li
                      key={`${item.id}-connector`}
                      aria-hidden="true"
                      className=" flex-1 w-full lg:hidden sm:block"
                    >
                      <div
                        className={cn("h-0.5 w-full", {
                          "bg-primary-600": isCompleted,
                          "bg-primary-300": !isCompleted,
                        })}
                      />
                    </li>
                  );

                  return [step, connector];
                })
                .reduce((acc, val) => acc.concat(val as any), [])}
            </ol>
          </nav>
        </aside>

        <section
          className="flex-1 w-full min-h-[calc(100vh-10rem)] md:mt-0 mt-4"
          role="account-verification-content"
        >
          {renderActiveComponent()}
        </section>
      </div>
    </div>
  );
}

export default AccountVerification;
