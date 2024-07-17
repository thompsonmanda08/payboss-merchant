//BUSINESS REGISTRATION STATUS
'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'
import useConfigStore from '@/context/configStore'
import { SelectField } from '@/components/base'
import { STEPS } from '../SignupForm'
import useAuthStore from '@/context/authStore'

// BUSINESS BANKING DETAILS
export default function Step2({ updateDetails }) {
  const configOptions = useConfigStore((state) => state.configOptions)
  const step = useAuthStore((state) => state.businessInfo)
  const banks = configOptions?.banks
  const branchCodeError =
    (step?.branch_code?.length > 1 && step?.branch_code?.length < 6) ||
    step?.branch_code?.length > 8
  const accountNumberError = step?.account_number?.length > 16

  return (
    <>
      <h3 className="self-start text-lg font-semibold leading-6 tracking-tight text-neutral-700">
        Banking Details
      </h3>
      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <SelectField
          options={banks}
          label="Bank"
          name="bankID"
          value={step?.bankID}
          listItemName={'bank_name'}
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { bankID: e.target.value })
          }}
        />
      </motion.div>

      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <Input
          label="Account Name"
          name="account_name"
          value={step?.account_name}
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { account_name: e.target.value })
          }}
        />
      </motion.div>

      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <Input
          label="Branch Name"
          name="branch_name"
          value={step?.branch_name}
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { branch_name: e.target.value })
          }}
        />
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
        variants={staggerContainerItemVariants}
        className="flex w-full gap-4"
      >
        <Input
          label="Account Number"
          name="account_number"
          className="w-full"
          value={step?.account_number}
          onError={accountNumberError}
          errorText={'Valid Bank Account No. is required'}
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { account_number: e.target.value })
          }}
        />
        <SelectField
          options={configOptions?.currencies}
          className={'w-[100px]'}
          wrapperClassName={'w-max'}
          label="Currency"
          name="currencyID"
          value={step?.currencyID}
          listItemName={'currency'}
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { currencyID: e.target.value })
          }}
        />
      </motion.div>
    </>
  )
}
