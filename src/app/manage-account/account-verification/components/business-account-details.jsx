import { getLocalTimeZone, today } from "@internationalized/date";

import DateSelectField from "@/components/ui/date-select-field";
import { Input } from "@/components/ui/input-field";
import SelectField from "@/components/ui/select-field";
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
          infoText={
            "Information about your business to help us verify your identity."
          }
          title="Business Details"
        />
        <div className="flex w-full flex-col items-center justify-center gap-6 lg:flex-row">
          <div className="flex w-full flex-1 flex-col gap-2">
            <Input
              isDisabled
              label="Business Name"
              name="businessName"
              required={true}
              type="text"
              value={businessDetails?.name}
            />

            <div className="flex w-full gap-4">
              <SelectField
                isDisabled
                label="Company Type"
                listItemName={"type"}
                name="companyTypeID"
                options={companyTypes}
                prefilled={true}
                value={businessDetails?.companytypeID}
              />
              <Input
                isDisabled
                label="TPIN"
                maxLength={10}
                name="tpin"
                type="number"
                value={businessDetails?.tpin}
              />
            </div>

            <DateSelectField
              isDisabled
              className="max-w-sm"
              description={"Date the company was registered"}
              label={"Date of Incorporation"}
              labelPlacement={"outside"}
              maxValue={today(getLocalTimeZone())}
              value={businessDetails?.date_of_incorporation?.split("T")[0]}
            />
          </div>

          {/* ADDRESS AND CONTACT INFORMATION */}
          <div className="mb-5 flex w-full flex-1 flex-col gap-2">
            <Input
              isDisabled
              label="Physical Address"
              name="physical_address"
              value={businessDetails?.physical_address}
            />

            <div className="flex w-full gap-4">
              <Input
                isDisabled
                label="Mobile Number"
                maxLength={12}
                name="contact"
                type="number"
                value={businessDetails?.contact}
                errorText="Invalid Mobile Number"
                // required={true}
                pattern="[0-9]{12}"
              />
              <Input
                isDisabled
                label="Website"
                name="website"
                value={businessDetails?.website}
              />
            </div>

            <Input
              isDisabled
              label="Company Email"
              name="company_email"
              type="email"
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
          infoText={
            "Please provide your banking details to receive your payments."
          }
          title="Banking Details"
        />
        <div className="flex w-full flex-col items-start justify-start gap-6 md:flex-row">
          <div className="flex w-full flex-1 flex-col gap-2">
            <Input
              isDisabled
              label="Account Holder Name"
              name="account_name"
              required={true}
              value={businessDetails?.account_name}
            />
            <Input
              isDisabled
              label="Account Number"
              name="account_number"
              required={true}
              value={businessDetails?.account_number}
            />
            <SelectField
              isDisabled
              label="Bank"
              listItemName={"bank_name"}
              name="bankID"
              options={banks}
              prefilled={true}
              required={true}
              value={businessDetails?.bankID}
            />
          </div>
          <div className="flex w-full flex-1 flex-col gap-2">
            <Input
              isDisabled
              label="Branch Name"
              name="branch_name"
              required={true}
              value={businessDetails?.branch_name}
            />

            <SelectField
              isDisabled
              label="Currency"
              listItemName={"currency"}
              name="currencyID"
              options={currencies}
              prefilled={true}
              required={true}
              value={businessDetails?.currencyID}
            />
          </div>
        </div>

        {allowUserToSubmitKYC && (
          <Button className={"my-4"} onPress={() => navigateToPage(2)}>
            Submit Documentation
          </Button>
        )}
      </div>
    </div>
  );
}

export default BusinessAccountDetails;
