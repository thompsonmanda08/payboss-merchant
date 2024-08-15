import { CardHeader } from '@/components/base'
import DateSelectField from '@/components/ui/DateSelectField'
import { Input } from '@/components/ui/InputField'
import SelectField from '@/components/ui/SelectField'
import { isValidZambianMobileNumber } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'
import { getLocalTimeZone, today, parseDate } from '@internationalized/date'
import { Button } from '@/components/ui/Button'
import useAccountProfile from '@/hooks/useProfileDetails'

function BusinessAccountDetails({
  businessDetails,
  companyTypes,
  banks,
  currencies,
  navigateToPage,
}) {
  const { allowUserToSubmitKYC } = useAccountProfile()

  const branchCodeError =
    (businessDetails?.branch_code?.length > 1 &&
      businessDetails?.branch_code?.length < 6) ||
    businessDetails?.branch_code?.length > 8

  const accountNumberError = businessDetails?.account_number?.length > 16

  const TPINError = businessDetails?.tpin?.length > 10
  const phoneNoError =
    !isValidZambianMobileNumber(businessDetails?.contact) &&
    businessDetails?.contact?.length > 1

  //TODO => FETCH ALL KYC DATA - INPUT FIELDS TO BE DISABLED
  return (
    <div className="mr-auto flex flex-col gap-y-10">
      <div className="flex flex-col gap-6">
        <CardHeader
          className={'py-0'}
          classNames={{
            infoClasses: 'mb-0',
            innerWrapper: 'gap-0',
          }}
          title="Business Details"
          infoText={
            'Information about your business to help us verify your identity.'
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
              onChange={(e) => {
                updateDetails(STEPS[0], { name: e.target.value })
              }}
            />

            <div className="flex w-full gap-4">
              <SelectField
                options={companyTypes}
                isDisabled
                label="Company Type"
                name="companyTypeID"
                listItemName={'type'}
                value={businessDetails?.companyTypeID}
                // required={true}
                // onChange={(e) => {
                //   updateDetails(STEPS[0], { companyTypeID: e.target.value })
                // }}
              />
              <Input
                type="number"
                label="TPIN"
                name="tpin"
                maxLength={10}
                isDisabled
                value={businessDetails?.tpin}
                onError={TPINError}
                errorText="Invalid TPIN"
                onChange={(e) => {
                  updateDetails(STEPS[0], { tpin: e.target.value })
                }}
              />
            </div>

            <DateSelectField
              label={'Date of Incorporation'}
              isDisabled
              className="max-w-sm"
              description={'Date the company was registered'}
              value={businessDetails?.date_of_incorporation?.split('T')[0]}
              maxValue={today(getLocalTimeZone())}
              labelPlacement={'outside'}
              onChange={(date) => {
                updateDetails(STEPS[0], {
                  date_of_incorporation: formatDate(date, 'YYYY-MM-DD'),
                })
              }}
            />
          </div>

          {/* ADDRESS AND CONTACT INFORMATION */}
          <div className="mb-5 flex w-full flex-1 flex-col gap-2">
            <Input
              label="Physical Address"
              name="physical_address"
              isDisabled
              value={businessDetails?.physical_address}
              // required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { physical_address: e.target.value })
              }}
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
                onChange={(e) => {
                  updateDetails(STEPS[0], { contact: e.target.value })
                }}
              />
              <Input
                label="Website"
                name="website"
                isDisabled
                value={businessDetails?.website}
                // pattern="https?://.+"
                onChange={(e) => {
                  updateDetails(STEPS[0], { website: e.target.value })
                }}
              />
            </div>

            <Input
              type="email"
              label="Company Email"
              name="company_email"
              isDisabled
              value={businessDetails?.company_email}
              // required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { company_email: e.target.value })
              }}
            />
          </div>
        </div>
      </div>
      {/* *********** BANKING DETAILS ***************** */}
      <div className="flex flex-col items-start gap-4">
        <CardHeader
          className={'py-0'}
          classNames={{
            infoClasses: 'mb-0',
            innerWrapper: 'gap-0',
          }}
          title="Banking Details"
          infoText={
            'Please provide your banking details to receive your payments.'
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
              onChange={(e) => {
                updateDetails(STEPS[0], { account_name: e.target.value })
              }}
            />
            <Input
              label="Account Number"
              name="account_number"
              isDisabled
              value={businessDetails?.account_number}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { account_number: e.target.value })
              }}
            />
            <SelectField
              options={banks}
              label="Bank"
              name="bankID"
              value={businessDetails?.bankID}
              isDisabled
              listItemName={'bank_name'}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { bankID: e.target.value })
              }}
            />
          </div>
          <div className="flex w-full flex-1 flex-col gap-2">
            <Input
              label="Branch Name"
              name="branch_name"
              isDisabled
              value={businessDetails?.branch_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { branch_name: e.target.value })
              }}
            />
            <Input
              label="Branch Code"
              name="branch_code"
              isDisabled
              value={businessDetails?.branch_code}
              onError={branchCodeError}
              errorText={'Valid Code is required'}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { branch_code: e.target.value })
              }}
            />
            <SelectField
              options={currencies}
              label="Currency"
              name="currencyID"
              isDisabled
              value={businessDetails?.currencyID}
              listItemName={'currency'}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { currencyID: e.target.value })
              }}
            />
          </div>
        </div>

        {allowUserToSubmitKYC && (
          <Button onPress={() => navigateToPage(1)}>Proceed</Button>
        )}
      </div>
    </div>
  )
}

export default BusinessAccountDetails
