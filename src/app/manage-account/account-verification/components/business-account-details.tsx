"use client";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input-field";
import SelectField from "@/components/ui/select-field";
import DateSelectField from "@/components/ui/date-select-field";
import { Button } from "@/components/ui/button";
import CardHeader from "@/components/base/card-header";
import { getLocalTimeZone, today } from "@internationalized/date";
import { cn } from "@/lib/utils";
import AutoCompleteField from "@/components/base/auto-complete";
import { staggerContainerItemVariants } from "@/lib/constants";
import { motion } from "framer-motion";
import UserProfile from "@/components/elements/user-profile-card";
import useKYCInfo from "@/hooks/use-kyc-info";

// Stepper component (basic version for now)
const Stepper = ({ currentStep }) => {
  const steps = ["Business Profile", "Address", "Contact Person"];
  return (
    <nav aria-label="Progress" className="mb-6">
      <ol role="list" className="flex items-center space-x-2 sm:space-x-4">
        {steps.map((step, index) => (
          <li key={step} className="flex-1">
            <a
              href="#" // Or handle step navigation
              className={cn(
                "group flex flex-col border-l-4 py-2 pl-4 transition-colors border-gray-200 hover:border-gray-300",
                {
                  "border-primary-600 hover:border-primary-800":
                    index <= currentStep - 1,
                },
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium transition-colors text-gray-500 group-hover:text-gray-700",
                  {
                    "text-primary-600 group-hover:text-primary-800":
                      index <= currentStep - 1,
                  },
                )}
              >
                Step {index + 1}
              </span>
              <span className="text-sm font-medium">{step}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export function BusinessInformationForm({
  businessDetails: business,
  companyTypes,
  onCompletionNavigateTo: navigateToPage,
  provinces,
}: {
  businessDetails: any;
  companyTypes: any[];
  onCompletionNavigateTo: (targetSectionId?: string) => void;
  provinces: any[];
}) {
  const { contactPerson } = useKYCInfo();
  const [currentStep, setCurrentStep] = useState(1); // For the stepper: 1:Profile, 2:Contact, etc.

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    navigateToPage();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const [province, city] = useMemo(() => {
    const province = provinces?.find((p) => p.id === business?.provinceID);
    const city = province?.cities?.find((c) => c.id === business?.cityID);
    return [province, city];
  }, [business?.provinceID, business?.cityID, provinces]);

  // Render different form parts based on currentStep
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Profile
        return (
          <div className="flex w-full flex-1 flex-col gap-4 lg:flex-row">
            <div className="flex w-full flex-1 flex-col gap-2 max-w-md">
              <motion.div variants={staggerContainerItemVariants}>
                <Input
                  label="Business Name"
                  name="businessName"
                  placeholder="Enter business name"
                  required={true}
                  type="text"
                  value={business?.name}
                  disabled={true}
                />
              </motion.div>

              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <SelectField
                  label="Company Type"
                  listItemName={"type"}
                  name="companyTypeID"
                  options={companyTypes}
                  prefilled={true}
                  required={true}
                  value={business?.companytypeID}
                  disabled={true}
                />
              </motion.div>
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  errorText="Invalid TPIN"
                  label="TPIN"
                  maxLength={10}
                  name="tpin"
                  placeholder="Enter TPIN"
                  required={true}
                  type="number"
                  value={business?.tpin}
                  disabled={true}
                />
              </motion.div>

              <motion.div variants={staggerContainerItemVariants}>
                <DateSelectField
                  className="max-w-md"
                  description={"Date the company was registered"}
                  label={"Date of Incorporation"}
                  labelPlacement={"outside"}
                  maxValue={today(getLocalTimeZone())}
                  required={true}
                  disabled={true}
                  value={business?.date_of_incorporation?.split("T")[0] || ""}
                />
              </motion.div>
            </div>
            <div className="mb-5 flex w-full flex-1 flex-col gap-2">
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  label="Company Email"
                  name="email"
                  placeholder="Enter company email"
                  required={true}
                  type="email"
                  value={business?.company_email}
                  disabled={true}
                />
              </motion.div>
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  errorText="Invalid Mobile Number"
                  label="Mobile Number"
                  maxLength={12}
                  name="contact"
                  pattern="[0-9]{12}"
                  placeholder="Enter mobile number (start with 0977/66/55)"
                  required={true}
                  type="number"
                  value={business?.contact}
                  disabled={true}
                />
              </motion.div>
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  label="Website / Social Media"
                  name="website"
                  pattern="https?://.+"
                  placeholder="Enter website / social media link"
                  required={true}
                  title="https://www.domain-name.com"
                  value={business?.website}
                  disabled={true}
                />
              </motion.div>
            </div>
          </div>
        );
      case 2: // Address
        return (
          <div className="flex w-full flex-1 flex-col gap-2 max-w-md">
            <div className="mb-5 flex w-full flex-1 flex-col gap-2">
              <motion.div
                className="w-full"
                variants={staggerContainerItemVariants}
              >
                <AutoCompleteField
                  defaultValue={province?.id}
                  label="Province"
                  listItemName={"province"}
                  name="provinceID"
                  options={provinces}
                  required={true}
                  value={business?.provinceID}
                  isDisabled={true}
                />
              </motion.div>
              <motion.div
                className="w-full"
                variants={staggerContainerItemVariants}
              >
                <AutoCompleteField
                  defaultValue={city?.id}
                  label="City/Town"
                  listItemName={"city"}
                  name="cityID"
                  options={province?.cities}
                  prefilled={true}
                  required={true}
                  value={business?.cityID}
                  isDisabled={true}
                />
              </motion.div>
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  label="Physical Address"
                  name="physical_address"
                  placeholder="Enter physical address"
                  required={true}
                  value={business?.physical_address}
                  disabled={true}
                />
              </motion.div>
            </div>
          </div>
        );
      case 3: // Contact Person
        return (
          <div className="flex w-full flex-1 flex-col gap-2 items-center justify-center">
            <UserProfile user={contactPerson} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:px-8 mx-auto p-2">
      <CardHeader
        title="Tell us more about your business"
        infoText="As a financial services company, we would need to verify your business registration information."
        className={"py-0 mb-6"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
      />
      <Stepper currentStep={currentStep} />

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {renderStepContent()}
        <div className="flex justify-between mt-8">
          <Button
            variant="light"
            onClick={handleBack}
            disabled={currentStep === 1 && true}
          >
            Back
          </Button>
          <Button onClick={handleContinue}>Next Section</Button>
        </div>
      </form>
    </div>
  );
}

export function BankAccountForm({
  businessDetails: business,
  banks = [],
  currencies = [],
  onCompletionNavigateTo: navigateToPage,
}) {
  return (
    <div className="w-full lg:px-8 mx-auto p-2">
      <CardHeader
        className={"py-0 mb-6"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
        title="Provide your business bank account number"
        infoText="Ensure the name on your bank account matches the legal business name you provided."
      />
      <form onSubmit={(e) => e.preventDefault()} className="">
        <motion.div
          className="w-full max-w-md gap-4 flex flex-col"
          variants={staggerContainerItemVariants}
        >
          <SelectField
            label="Bank"
            listItemName={"bank_name"}
            name="bankID"
            options={banks}
            prefilled={true}
            required={true}
            value={business.bankID}
            isDisabled={true}
          />
          <Input
            label="Account Number"
            name="accountNumber"
            value={business.account_number}
            isDisabled={true}
            required
          />
          <Input
            label="Branch Name"
            name="branchName"
            value={business.branch_name}
            isDisabled={true}
            placeholder="Provide your branch name"
          />
          <Input
            label="Branch Code"
            name="branchCode"
            value={business.branch_code}
            isDisabled={true}
          />
          <Input
            label="Account Holder Name"
            name="accountHolderName"
            value={business.account_name}
            isDisabled={true}
            required
            placeholder="Provide your account holder name"
          />

          <SelectField
            label="Currency"
            listItemName={"currency"}
            name="currencyID"
            options={currencies}
            prefilled={true}
            required={true}
            value={business?.currencyID}
            isDisabled={true}
          />
        </motion.div>
        <div className="flex justify-between mt-8">
          <Button variant="light" onClick={() => navigateToPage("business")}>
            Back
          </Button>
          <Button onClick={() => navigateToPage("documents")}>
            Next Section
          </Button>
        </div>
      </form>
    </div>
  );
}
