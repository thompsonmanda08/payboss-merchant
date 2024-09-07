//BUSINESS REGISTRATION STATUS
'use client'
import React from 'react'
import { Input } from '@/components/ui/InputField'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'

import { CardHeader } from '@/components/base'
import { STEPS } from '../SignupForm'
import useAuthStore from '@/context/authStore'
import SelectField from '@/components/ui/SelectField'
import useConfigOptions from '@/hooks/useConfigOptions'

// BUSINESS BANKING DETAILS
export default function Step2({ updateDetails, backToStart }) {
  const { banks, currencies } = useConfigOptions()
  const step = useAuthStore((state) => state.businessInfo)
  const branchCodeError =
    (step?.branch_code?.length > 1 && step?.branch_code?.length < 6) ||
    step?.branch_code?.length > 8
  const accountNumberError = step?.account_number?.length > 16

  return (
    <>
      <CardHeader
        title="Banking Details"
        infoText={
          'Please provide your banking details to receive your payments.'
        }
        handleClose={() => backToStart()}
      />
      <div className="flex w-full flex-col items-start justify-start gap-6 md:flex-row">
        <div className="flex w-full flex-1 flex-col gap-2">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Account Holder Name"
              name="account_name"
              value={step?.account_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { account_name: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Account Number"
              name="account_number"
              value={step?.account_number}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { account_number: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              options={banks}
              label="Bank"
              name="bankID"
              value={step?.bankID}
              prefilled={true}
              listItemName={'bank_name'}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { bankID: e.target.value })
              }}
            />
          </motion.div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-2 ">
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Branch Name"
              name="branch_name"
              value={step?.branch_name}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { branch_name: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <Input
              label="Branch Code"
              name="branch_code"
              value={step?.branch_code}
              onError={branchCodeError}
              errorText={'Valid Code is required'}
              required={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { branch_code: e.target.value })
              }}
            />
          </motion.div>
          <motion.div
            className="w-full"
            variants={staggerContainerItemVariants}
          >
            <SelectField
              options={currencies}
              label="Currency"
              name="currencyID"
              value={step?.currencyID}
              listItemName={'currency'}
              required={true}
              prefilled={true}
              onChange={(e) => {
                updateDetails(STEPS[0], { currencyID: e.target.value })
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}
