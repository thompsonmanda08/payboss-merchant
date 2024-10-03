//BUSINESS REGISTRATION STATUS
'use client'
import React, { useMemo } from 'react'
import { Input } from '@/components/ui/InputField'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'
import { formatDate, isValidZambianMobileNumber } from '@/lib/utils'
import { STEPS } from '../SignupForm'
import DateSelectField from '@/components/ui/DateSelectField'
import useAuthStore from '@/context/authStore'
import { getLocalTimeZone, today } from '@internationalized/date'
import SelectField from '@/components/ui/SelectField'
import useConfigOptions from '@/hooks/useConfigOptions'
import CardHeader from '@/components/base/CardHeader'

export default function Step1({ updateDetails, backToStart }) {
  const { companyTypes, provinces } = useConfigOptions()
  const step = useAuthStore((state) => state.businessInfo)

  const TPINError = step?.tpin?.length > 10
  const phoneNoError =
    !isValidZambianMobileNumber(step?.contact) && step?.contact?.length > 9

  const cities = useMemo(() => {
    if (step?.provinceID) {
      return (
        provinces?.find((province) => province?.ID === step?.provinceID)
          ?.cities || provinces[0]?.cities
      )
    }
    return []
  }, [step?.provinceID, provinces])

  return (
    <>
      <CardHeader
        title="Business Details"
        infoText={
          'Information about your business to help us verify your identity.'
        }
        handleClose={() => backToStart()}
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
              prefilled={true}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { companyTypeID: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            key={'step-1-1'}
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <Input
              type="number"
              label="TPIN"
              name="tpin"
              maxLength={10}
              value={step?.tpin}
              onError={TPINError}
              errorText="Invalid TPIN"
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { tpin: e.target.value })
              }}
            />
          </motion.div>

          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              type="email"
              label="Company Email"
              name="company_email"
              value={step?.company_email}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { company_email: e.target.value })
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
              defaultValue={step?.date_of_incorporation}
              value={
                step?.date_of_incorporation?.split('').length > 9
                  ? step?.date_of_incorporation
                  : undefined
              }
              maxValue={today(getLocalTimeZone())}
              labelPlacement={'outside'}
              required={true}
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
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              options={provinces}
              label="Province"
              name="provinceID"
              defaultValue={provinces[0]?.ID}
              listItemName={'province'}
              value={step?.provinceID}
              prefilled={true}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { provinceID: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              options={cities}
              label="City/Town"
              name="cityID"
              listItemName={'city'}
              defaultValue={cities[0]?.ID}
              value={step?.cityID}
              prefilled={true}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { cityID: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <Input
              label="Physical Address"
              name="physical_address"
              value={step?.physical_address}
              required={true}
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
              pattern="[0-9]{12}"
              onError={phoneNoError}
              errorText="Invalid Mobile Number"
              value={step?.contact}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { contact: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            variants={staggerContainerItemVariants}
            className="flex w-full gap-4"
          >
            <Input
              label="Website / Social Media"
              name="website"
              value={step?.website}
              prefilled={true}
              required={true}
              pattern="https?://.+"
              title="https://www.domain-name.com"
              onChange={(e) => {
                updateDetails(STEPS[0], { website: e.target.value })
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}
