'use client';
import { getLocalTimeZone, today } from '@internationalized/date';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';

import AutoCompleteField from '@/components/base/auto-complete';
import CardHeader from '@/components/base/card-header';
import UserProfile from '@/components/elements/user-profile-card';
import { Button } from '@/components/ui/button';
import DateSelectField from '@/components/ui/date-select-field';
import { Input } from '@/components/ui/input-field';
import SelectField from '@/components/ui/select-field';
import useKYCInfo from '@/hooks/use-kyc-info';
import { staggerContainerItemVariants } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Stepper component (basic version for now)
const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ['Business Profile', 'Address', 'Contact Person'];

  return (
    <nav aria-label="Progress" className="mb-6">
      <ol className="flex items-center space-x-2 sm:space-x-4" role="list">
        {steps.map((step, index) => (
          <li key={step} className="flex-1">
            <a
              className={cn(
                'group flex flex-col border-l-4 py-2 pl-4 transition-colors border-gray-200 hover:border-gray-300',
                {
                  'border-primary-600 hover:border-primary-800':
                    index <= currentStep - 1,
                },
              )}
              href="#" // Or handle step navigation
            >
              <span
                className={cn(
                  'text-sm font-medium transition-colors text-gray-500 group-hover:text-gray-700',
                  {
                    'text-primary-600 group-hover:text-primary-800':
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
    const city = province?.cities?.find((c: any) => c.id === business?.cityID);

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
                  disabled={true}
                  label="Business Name"
                  name="businessName"
                  placeholder="Enter business name"
                  required={true}
                  type="text"
                  value={business?.name}
                />
              </motion.div>

              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <SelectField
                  disabled={true}
                  label="Company Type"
                  listItemName={'type'}
                  name="companyTypeID"
                  options={companyTypes}
                  prefilled={true}
                  required={true}
                  value={business?.companytypeID}
                />
              </motion.div>
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  disabled={true}
                  errorText="Invalid TPIN"
                  label="TPIN"
                  maxLength={10}
                  name="tpin"
                  placeholder="Enter TPIN"
                  required={true}
                  type="number"
                  value={business?.tpin}
                />
              </motion.div>

              <motion.div variants={staggerContainerItemVariants}>
                <DateSelectField
                  className="max-w-md"
                  description={'Date the company was registered'}
                  disabled={true}
                  label={'Date of Incorporation'}
                  labelPlacement={'outside'}
                  maxValue={today(getLocalTimeZone())}
                  required={true}
                  value={business?.date_of_incorporation?.split('T')[0] || ''}
                />
              </motion.div>
            </div>
            <div className="mb-5 flex w-full flex-1 flex-col gap-2">
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  disabled={true}
                  label="Company Email"
                  name="email"
                  placeholder="Enter company email"
                  required={true}
                  type="email"
                  value={business?.company_email}
                />
              </motion.div>
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  disabled={true}
                  errorText="Invalid Mobile Number"
                  label="Mobile Number"
                  maxLength={12}
                  name="contact"
                  pattern="[0-9]{12}"
                  placeholder="Enter mobile number (start with 0977/66/55)"
                  required={true}
                  type="number"
                  value={business?.contact}
                />
              </motion.div>
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  disabled={true}
                  label="Website / Social Media"
                  name="website"
                  pattern="https?://.+"
                  placeholder="Enter website / social media link"
                  required={true}
                  title="https://www.domain-name.com"
                  value={business?.website}
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
                  // defaultValue={province?.id}
                  isDisabled={true}
                  label="Province"
                  listItemName={'province'}
                  name="provinceID"
                  options={provinces}
                  required={true}
                  value={business?.provinceID}
                />
              </motion.div>
              <motion.div
                className="w-full"
                variants={staggerContainerItemVariants}
              >
                <AutoCompleteField
                  // defaultValue={city?.id}
                  isDisabled={true}
                  label="City/Town"
                  listItemName={"city"}
                  name="cityID"
                  value={business?.cityID}
                  options={province?.cities}
                  // prefilled={true}
                  required={true}
                />
              </motion.div>
              <motion.div
                className="flex w-full gap-4"
                variants={staggerContainerItemVariants}
              >
                <Input
                  disabled={true}
                  label="Physical Address"
                  name="physical_address"
                  placeholder="Enter physical address"
                  required={true}
                  value={business?.physical_address}
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
        className={'py-0 mb-6'}
        classNames={{
          infoClasses: 'mb-0',
          innerWrapper: 'gap-0',
        }}
        infoText="As a financial services company, we would need to verify your business registration information."
        title="Tell us more about your business"
      />
      <Stepper currentStep={currentStep} />

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}
        <div className="flex justify-between mt-8">
          <Button
            disabled={currentStep === 1 && true}
            variant="light"
            onClick={handleBack}
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
}: {
  businessDetails: any;
  banks: any[];
  currencies: any[];
  onCompletionNavigateTo: (targetSectionId: string) => void;
}) {
  return (
    <div className="w-full lg:px-8 mx-auto p-2">
      <CardHeader
        className={'py-0 mb-6'}
        classNames={{
          infoClasses: 'mb-0',
          innerWrapper: 'gap-0',
        }}
        infoText="Ensure the name on your bank account matches the legal business name you provided."
        title="Provide your business bank account number"
      />
      <form className="" onSubmit={(e) => e.preventDefault()}>
        <motion.div
          className="w-full max-w-md gap-4 flex flex-col"
          variants={staggerContainerItemVariants}
        >
          <SelectField
            isDisabled={true}
            label="Bank"
            listItemName={'bank_name'}
            name="bankID"
            options={banks}
            prefilled={true}
            required={true}
            value={business.bankID}
          />
          <Input
            required
            isDisabled={true}
            label="Account Number"
            name="accountNumber"
            value={business.account_number}
          />
          <Input
            isDisabled={true}
            label="Branch Name"
            name="branchName"
            placeholder="Provide your branch name"
            value={business.branch_name}
          />
          <Input
            isDisabled={true}
            label="Branch Code"
            name="branchCode"
            value={business.branch_code}
          />
          <Input
            required
            isDisabled={true}
            label="Account Holder Name"
            name="accountHolderName"
            placeholder="Provide your account holder name"
            value={business.account_name}
          />

          <SelectField
            isDisabled={true}
            label="Currency"
            listItemName={'currency'}
            name="currencyID"
            options={currencies}
            prefilled={true}
            required={true}
            value={business?.currencyID}
          />
        </motion.div>
        <div className="flex justify-between mt-8">
          <Button variant="light" onClick={() => navigateToPage('business')}>
            Back
          </Button>
          <Button onClick={() => navigateToPage('documents')}>
            Next Section
          </Button>
        </div>
      </form>
    </div>
  );
}
