import { CardHeader } from '@/components/base'
import DateSelectField from '@/components/ui/DateSelectField'
import { Input } from '@/components/ui/InputField'
import SelectField from '@/components/ui/SelectField'
import { isValidZambianMobileNumber } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'
import { getLocalTimeZone, today } from '@internationalized/date'

function BusinessAccountDetails({ user, companyTypes, banks, currencies }) {
  const branchCodeError =
    (user?.branch_code?.length > 1 && user?.branch_code?.length < 6) ||
    user?.branch_code?.length > 8

  const accountNumberError = user?.account_number?.length > 16

  const TPINError = user?.tpin?.length > 10
  const phoneNoError =
    !isValidZambianMobileNumber(user?.contact) && user?.contact?.length > 1

  

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
              value={user?.merchant}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { name: e.target.value })
              }}
            />

            <div className="flex w-full gap-4">
              <SelectField
                options={companyTypes}
                label="Company Type"
                name="companyTypeID"
                listItemName={'type'}
                value={user?.companyTypeID}
                // required={true}
                onChange={(e) => {
                  updateDetails(STEPS[0], { companyTypeID: e.target.value })
                }}
              />
              <Input
                type="number"
                label="TPIN"
                name="tpin"
                maxLength={10}
                value={user?.tpin}
                onError={TPINError}
                errorText="Invalid TPIN"
                onChange={(e) => {
                  updateDetails(STEPS[0], { tpin: e.target.value })
                }}
              />
            </div>

            <DateSelectField
              label={'Date of Incorporation'}
              className="max-w-sm"
              description={'Date the company was registered'}
              value={user?.date_of_incorporation}
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
              value={user?.physical_address}
              // required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { physical_address: e.target.value })
              }}
            />

            <div className="flex w-full gap-4">
              <Input
                type="number"
                label="Mobile Number"
                name="contact"
                maxLength={12}
                value={user?.contact}
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
                value={user?.website}
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
              value={user?.company_email}
              // required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { company_email: e.target.value })
              }}
            />
          </div>
        </div>
      </div>
      {/* *********** BANKING DETAILS ***************** */}
      <div className="flex flex-col gap-6">
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
              value={user?.account_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { account_name: e.target.value })
              }}
            />
            <Input
              label="Account Number"
              name="account_number"
              value={user?.account_number}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { account_number: e.target.value })
              }}
            />
            <SelectField
              options={banks}
              label="Bank"
              name="bankID"
              value={user?.bankID}
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
              value={user?.branch_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { branch_name: e.target.value })
              }}
            />
            <Input
              label="Branch Code"
              name="branch_code"
              value={user?.branch_code}
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
              value={user?.currencyID}
              listItemName={'currency'}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { currencyID: e.target.value })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessAccountDetails
