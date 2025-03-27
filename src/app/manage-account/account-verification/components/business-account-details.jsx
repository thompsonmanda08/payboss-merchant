import DateSelectField from "@/components/ui/date-select-field";
import { Input } from "@/components/ui/input-field";
import SelectField from "@/components/ui/select-field";
import React from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@/components/ui/button";
import useAccountProfile from "@/hooks/useProfileDetails";
import CardHeader from "@/components/base/card-header";

function BusinessAccountDetails({
  businessDetails,
  companyTypes,
  banks,
  currencies,
  navigateToPage,
}) {
  const { allowUserToSubmitKYC } = useAccountProfile();

  return (
    <div className="mr-auto flex flex-col gap-y-10">
      <div className="flex flex-col gap-6">
        <CardHeader
          className={"py-0"}
          classNames={{
            infoClasses: "mb-0",
            innerWrapper: "gap-0",
          }}
          title="Business Details"
          infoText={
            "Information about your business to help us verify your identity."
          }
        />
        <div className="flex w-full flex-col items-center justify-center gap-6 lg:flex-row">
          <div className="flex w-full flex-1 flex-col gap-2">
            <Input
              type="text"
              label="Business Name"
              name="businessName"
              isDisabled
              value={businessDetails?.name}
              required={true}
            />

            <div className="flex w-full gap-4">
              <SelectField
                options={companyTypes}
                isDisabled
                label="Company Type"
                name="companyTypeID"
                listItemName={"type"}
                prefilled={true}
                value={businessDetails?.companytypeID}
              />
              <Input
                type="number"
                label="TPIN"
                name="tpin"
                maxLength={10}
                isDisabled
                value={businessDetails?.tpin}
              />
            </div>

            <DateSelectField
              label={"Date of Incorporation"}
              isDisabled
              className="max-w-sm"
              description={"Date the company was registered"}
              value={businessDetails?.date_of_incorporation?.split("T")[0]}
              maxValue={today(getLocalTimeZone())}
              labelPlacement={"outside"}
            />
          </div>

          {/* ADDRESS AND CONTACT INFORMATION */}
          <div className="mb-5 flex w-full flex-1 flex-col gap-2">
            <Input
              label="Physical Address"
              name="physical_address"
              isDisabled
              value={businessDetails?.physical_address}
            />

            <div className="flex w-full gap-4">
              <Input
                type="number"
                label="Mobile Number"
                isDisabled
                name="contact"
                maxLength={12}
                value={businessDetails?.contact}
                onError={phoneNoError}
                errorText="Invalid Mobile Number"
                // required={true}
                pattern="[0-9]{12}"
              />
              <Input
                label="Website"
                name="website"
                isDisabled
                value={businessDetails?.website}
              />
            </div>

            <Input
              type="email"
              label="Company Email"
              name="company_email"
              isDisabled
              value={businessDetails?.company_email}
            />
          </div>
        </div>
      </div>
      {/* *********** BANKING DETAILS ***************** */}
      <div className="flex flex-col items-start gap-4">
        <CardHeader
          className={"py-0"}
          classNames={{
            infoClasses: "mb-0",
            innerWrapper: "gap-0",
          }}
          title="Banking Details"
          infoText={
            "Please provide your banking details to receive your payments."
          }
        />
        <div className="flex w-full flex-col items-start justify-start gap-6 md:flex-row">
          <div className="flex w-full flex-1 flex-col gap-2">
            <Input
              label="Account Holder Name"
              name="account_name"
              isDisabled
              value={businessDetails?.account_name}
              required={true}
            />
            <Input
              label="Account Number"
              name="account_number"
              isDisabled
              value={businessDetails?.account_number}
              required={true}
            />
            <SelectField
              options={banks}
              label="Bank"
              name="bankID"
              value={businessDetails?.bankID}
              isDisabled
              prefilled={true}
              listItemName={"bank_name"}
              required={true}
            />
          </div>
          <div className="flex w-full flex-1 flex-col gap-2">
            <Input
              label="Branch Name"
              name="branch_name"
              isDisabled
              value={businessDetails?.branch_name}
              required={true}
            />
            <Input
              label="Branch Code"
              name="branch_code"
              isDisabled
              value={businessDetails?.branch_code}
              errorText={"Valid Code is required"}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { branch_code: e.target.value });
              }}
            />
            <SelectField
              options={currencies}
              label="Currency"
              name="currencyID"
              isDisabled
              prefilled={true}
              value={businessDetails?.currencyID}
              listItemName={"currency"}
              required={true}
            />
          </div>
        </div>

        {allowUserToSubmitKYC && (
          <Button onPress={() => navigateToPage(2)}>Proceed</Button>
        )}
      </div>
    </div>
  );
}

export default BusinessAccountDetails;
