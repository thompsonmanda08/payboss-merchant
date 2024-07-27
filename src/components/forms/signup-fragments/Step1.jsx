//BUSINESS REGISTRATION STATUS
'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'
import useConfigStore from '@/context/configStore'
import { formatDate, isValidZambianMobileNumber } from '@/lib/utils'
import { STEPS } from '../SignupForm'
import { CardHeader } from '@/components/base'
import DateSelectField from '@/components/ui/DateSelectField'
import useAuthStore from '@/context/authStore'
import { getLocalTimeZone, today } from '@internationalized/date'
import SelectField from '@/components/ui/SelectField'

export default function Step1({ updateDetails }) {
  const configOptions = useConfigStore((state) => state.configOptions)
  const step = useAuthStore((state) => state.businessInfo)
  useAuthStore((state) => state)

  const companyTypes = configOptions?.companyTypes
  const TPINError = step?.tpin?.length > 10
  const phoneNoError =
    !isValidZambianMobileNumber(step?.contact) && step?.contact?.length > 1

  return (
    <>
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
          <motion.div
            key={'step-1-2'}
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              type="text"
              label="Business Name"
              name="businessName"
              value={step?.name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { name: e.target.value })
              }}
            />
          </motion.div>

          <motion.div
            key={'step-1-1'}
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <SelectField
              options={companyTypes}
              label="Company Type"
              name="companyTypeID"
              listItemName={'type'}
              value={step?.companyTypeID}
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
              value={step?.tpin}
              onError={TPINError}
              errorText="Invalid TPIN"
              onChange={(e) => {
                updateDetails(STEPS[0], { tpin: e.target.value })
              }}
            />
          </motion.div>

          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <DateSelectField
              label={'Date of Incorporation'}
              className="max-w-sm"
              description={'Date the company was registered'}
              value={step?.date_of_incorporation}
              maxValue={today(getLocalTimeZone())}
              labelPlacement={'outside'}
              onChange={(date) => {
                updateDetails(STEPS[0], {
                  date_of_incorporation: formatDate(date, 'YYYY-MM-DD'),
                })
              }}
            />
          </motion.div>
        </div>

        <div className="mb-5 flex w-full flex-1 flex-col gap-2">
          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <Input
              label="Physical Address"
              name="physical_address"
              value={step?.physical_address}
              // required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { physical_address: e.target.value })
              }}
            />
          </motion.div>

          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <Input
              type="number"
              label="Mobile Number"
              name="contact"
              maxLength={12}
              value={step?.contact}
              onError={phoneNoError}
              errorText="Invalid Mobile Number"
              // required={true}
              pattern="[0-9]{12}"
              onChange={(e) => {
                updateDetails(STEPS[0], { contact: e.target.value })
              }}
            />
            <Input
              // TODO: REGEX FOR WEBSITE TEST
              label="Website"
              name="website"
              value={step?.website}
              // pattern="https?://.+"
              onChange={(e) => {
                updateDetails(STEPS[0], { website: e.target.value })
              }}
            />
          </motion.div>

          <motion.div
            key={'step-1-3'}
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              type="email"
              label="Company Email"
              name="company_email"
              value={step?.company_email}
              // required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { company_email: e.target.value })
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}
