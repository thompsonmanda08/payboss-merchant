"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, addToast } from "@heroui/react";

import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { containerVariants } from "@/lib/constants";
import useAuthStore from "@/context/auth-store";
import {
  createMerchantAdminUser,
  createNewMerchant,
  submitMerchantBankDetails,
} from "@/app/_actions/auth-actions";

import { Button } from "../ui/button";
import StatusMessage from "../base/status-message";

import Step0 from "./signup-fragments/step-0";
import Step1 from "./signup-fragments/step-1";
import Step2 from "./signup-fragments/step-2";
import Step3 from "./signup-fragments/step-3";
import Step1_TPIN from "./signup-fragments/step-1-1";

export const STEPS = [
  "business-registration",
  "business-information",
  "business-bank-details",
  "user-information",
];

export default function SignUpForm({
  superMerchantID,
}: {
  superMerchantID: string;
}) {
  const {
    businessInfo,
    newAdminUser,
    bankDetails,
    error,
    updateErrorStatus,
    setBusinessInfo,
    setBankingDetails,
    setNewAdminUser,
    isLoading,
    setIsLoading,
    setAccountCreated,
    merchantID,
    setMerchantID,
    setError,
    isValidTPIN,
    resetAuthData,
  } = useAuthStore();

  const NEW_REGISTRATION = [
    // BUSINESS INFO
    <Step1
      key={STEPS[1] + "_NEW"}
      backToStart={handleGotoStart}
      updateDetails={updateAccountDetails}
    />,

    <Step2
      key={STEPS[2]} // BANK DETAILS
      backToStart={handleGotoStart}
      updateDetails={updateAccountDetails}
    />,

    <Step3
      key={STEPS[3]} // ADMIN USER (OWNER)
      backToStart={handleGotoStart}
      updateDetails={updateAccountDetails}
    />,
  ];

  const CONTINUE_REGISTRATION = [
    <Step1_TPIN
      key={STEPS[1] + "_CONTINUE"} // GET ACCOUNT DETAILS BY TPIN
      backToStart={handleGotoStart}
      updateDetails={updateAccountDetails}
    />,
    <Step2
      key={STEPS[2]} // BANK DETAILS
      backToStart={handleGotoStart}
      updateDetails={updateAccountDetails}
    />,
    <Step3
      key={STEPS[3]} // ADMIN USER (OWNER)
      backToStart={handleGotoStart}
      updateDetails={updateAccountDetails}
    />,
  ];

  const RENDERED_COMPONENTS =
    businessInfo?.registration != "NEW"
      ? CONTINUE_REGISTRATION
      : NEW_REGISTRATION;

  const {
    activeTab,
    navigateForward,
    navigateBackwards,
    navigateTo,
    currentTabIndex,
    firstTab,
    lastTab,
  } = useCustomTabsHook([
    <Step0 key={STEPS[0]} updateDetails={updateAccountDetails} />, // BUSINESS SPACE TYPE
    ...RENDERED_COMPONENTS,
  ]);

  const isLastStep = currentTabIndex === lastTab;
  const isFirstStep = currentTabIndex === firstTab;

  function handleGotoStart() {
    resetAuthData();
    navigateTo(0);
  }
  function goTo(i: number) {
    navigateTo(i);
  }

  function updateAccountDetails(
    step: (typeof STEPS)[number],
    fields: Partial<typeof businessInfo>,
  ) {
    // BUSINESS INFO
    if (STEPS[0] == step || STEPS[1] == step) {
      setBusinessInfo({ ...businessInfo, ...fields });

      return;
    }

    if (STEPS[2] == step) {
      setBankingDetails({ ...bankDetails, ...fields });

      return;
    }

    // NEW ADMIN USER
    if (STEPS[3] == step) {
      setNewAdminUser({ ...newAdminUser, ...fields });
    }
  }

  async function handleCreateAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    updateErrorStatus({ status: false, message: "" });

    // ******** STEP: 0 ==>  USER CHOOSES TO EITHER CONTINUE OR START A NEW REGISTRATION ********** //
    if (businessInfo.registration == "CONTINUE" && !isValidTPIN) {
      navigateForward();
      setIsLoading(false);

      return;
    }
    // ******************************************************************************************** //

    // ************** STEP: 1 ==>  CONTINUE NEW MERCHANT ACCOUNT CREATION ************************* //
    // IF USER IS CONTINUING REGISTRATION AND HAS PROVIDED A VALID TPIN
    // THEN NAVIGATE THEM TO CORRECT STAGE
    if (
      businessInfo.registration == "CONTINUE" &&
      currentTabIndex === 1 &&
      isValidTPIN &&
      businessInfo?.stage // EXPECTED TO BE EITHER 2 OR 3
    ) {
      navigateTo(Number(businessInfo?.stage + currentTabIndex)); // INDEX START FROM ZERO
      setIsLoading(false);

      return;
    }

    // ******************************************************************************************** //

    // ************** STEP: 1 ==>  CREATE NEW MERCHANT ACCOUNT *********************************** //
    if (currentTabIndex === 1 && STEPS[currentTabIndex] === STEPS[1]) {
      const response = await createNewMerchant({
        ...businessInfo,
        super_merchant_id: superMerchantID,
      });

      let merchantID = response?.data?.merchantID;

      if (merchantID) {
        setMerchantID(merchantID);
      }

      if (response?.success && (response?.data?.merchantID || merchantID)) {
        addToast({
          color: "success",
          title: "Success",
          description: "Business Details Submitted!",
        });
        navigateForward();
        setIsLoading(false);

        return;
      } else {
        addToast({
          color: "danger",
          title: "Failed",
          description: "Error Submitting Business Details",
        });
        updateErrorStatus({ status: true, message: response?.message });
        setIsLoading(false);

        return;
      }
    }
    // ******************************************************************************************** //

    // ************** STEP: 2 ==>  APPEND MERCHANT ACCOUNT BANK DETAILS *************************** //
    if (currentTabIndex === 2 && STEPS[currentTabIndex] === STEPS[2]) {
      const response = await submitMerchantBankDetails(bankDetails, merchantID);

      if (response?.success) {
        addToast({
          color: "success",
          title: "Success",
          description: "Bank information Submitted!",
        });
        navigateForward();
        setIsLoading(false);

        return;
      } else {
        addToast({
          color: "danger",
          title: "Failed",
          description: "Error Submitting Bank information!",
        });
        updateErrorStatus({ status: true, message: response?.message });
        setIsLoading(false);

        return;
      }
    }
    // ******************************************************************************************** //

    // ******************** STEP: 3 ==>  CREATE ADMIN USER - LAST STEP *************************** //
    if (isLastStep && STEPS[currentTabIndex] === STEPS[lastTab]) {
      // Passwords Validation
      if (newAdminUser?.password !== newAdminUser?.confirmPassword) {
        updateErrorStatus({
          onPassword: true,
          message: "Passwords do not match",
        });
        setIsLoading(false);

        return;
      }

      let response = await createMerchantAdminUser(newAdminUser, merchantID);

      if (response?.success) {
        addToast({
          color: "success",
          title: "Success",
          description: "Account Created Successfully",
        });
        setAccountCreated(true);
        setIsLoading(false);

        return;
      } else {
        addToast({
          color: "danger",
          title: "Failed",
          description: "Error Creating Account!",
        });
        updateErrorStatus({ status: true, message: response?.message });
        setIsLoading(false);

        return;
      }
    }
    // ******************************************************************************************** //

    if (!isLastStep) {
      navigateForward();
      setIsLoading(false);

      return;
    }
  }

  useEffect(() => {
    // Clean out any errors if the user makes any changes to the form
    setError({});
  }, [newAdminUser, businessInfo]);

  // FOR REGISTRATION

  return (
    <Card className="mx-auto w-full flex-auto p-6 sm:max-w-[790px]">
      <div className="flex flex-col">
        <form
          className="mx-auto flex w-full flex-col items-center justify-center gap-4"
          onSubmit={handleCreateAccount}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTabIndex}
              className="flex w-full flex-col items-center justify-center gap-y-4"
              animate={"show"}
              exit={"exit"}
              initial={"hidden"}
              transition={{ duration: 0.5 }}
              variants={containerVariants}
            >
              {activeTab}
            </motion.div>
          </AnimatePresence>

          {error?.status && (
            <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center">
              <StatusMessage error={error.status} message={error.message} />
            </div>
          )}

          <div className="mt-5 flex w-full items-end justify-center gap-4 md:justify-end">
            <Button
              className="w-full"
              color="primary"
              disabled={
                isLoading ||
                (businessInfo.registration == "CONTINUE" &&
                  !isValidTPIN &&
                  currentTabIndex === 1)
              }
              isLoading={isLoading}
              size="lg"
              type={"submit"}
            >
              {isFirstStep
                ? "Get Started"
                : !isLastStep
                  ? "Next"
                  : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
