'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { Spinner, RadioGroup, DatePicker } from '@nextui-org/react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import {
  CustomRadioButton,
  FileDropZone,
  SelectField,
  StatusMessage,
} from '../base'
import { Button } from '../ui/Button'
import { DateInput } from '@nextui-org/react'
import { CalendarDate } from '@internationalized/date'
import {
  staggerContainerItemVariants,
  staggerContainerVariants,
} from '@/lib/constants'
import { ArrowUturnLeftIcon, BackwardIcon } from '@heroicons/react/24/outline'
import useConfigStore from '@/context/configStore'
import { useGeneralConfigOptions } from '@/hooks/useQueryHooks'
import DateSelectField from '../ui/DateSelectField'
import { cn, formatDate, notify } from '@/lib/utils'
import useAuthStore from '@/context/authStore'

const STEPS = [
  'business-registration',
  'business-information',
  'business-bank-details',
  'business-documentation',
  'personal-information',
]

export default function SignUpForm() {
  const { push } = useRouter()

  const {
    businessInfo,
    newAdminUser,
    businessDocs,
    error,
    updateErrorStatus,
    setBusinessInfo,
    setNewAdminUser,
    setBusinessDocs,
    isLoading,
    setIsLoading,
  } = useAuthStore()

  function updateAccountDetails(step, fields) {
    // BUSINESS INFO
    if (STEPS[0] == step) {
      setBusinessInfo({ ...businessInfo, ...fields })
    }

    // BUSINESS DOCS
    if (STEPS[3] == step) {
      setBusinessDocs({ ...businessDocs, ...fields })
    }

    // NEW ADMIN USER
    if (STEPS[4] == step) {
      setNewAdminUser({ ...newAdminUser, ...fields })
    }
  }

  const {
    activeTab,
    navigateForward,
    navigateBackwards,
    navigateTo,
    currentTabIndex,
    firstTab,
    lastTab,
  } = useCustomTabsHook([
    <Step4 key={STEPS[4]} updateDetails={updateAccountDetails} />,
    <Step0 key={STEPS[0]} updateDetails={updateAccountDetails} />,
    <Step1 key={STEPS[0]} updateDetails={updateAccountDetails} />,
    <Step2 key={STEPS[2]} updateDetails={updateAccountDetails} />,
    <Step3 key={STEPS[3]} updateDetails={updateAccountDetails} />,
  ])

  const isLastStep = currentTabIndex === lastTab
  const isFirstStep = currentTabIndex === firstTab

  async function handleCreateAccount(e) {
    e.preventDefault()
    setIsLoading(true)
    updateErrorStatus({ status: false, message: '' })

    if (businessInfo.businessRegistrationStatus == 'UNREGISTERED_BUSINESS') {
      notify('error', 'Not Available Yet')
      setIsLoading(false)
      return
    }

    if (!isLastStep) {
      navigateForward()
      setIsLoading(false)
      return
    }

    if (newAdminUser?.password !== newAdminUser?.confirmPassword) {
      updateErrorStatus({
        status: true,
        onPassword: true,
        message: 'Passwords do not match',
      })
      setIsLoading(false)

      return
    }

    console.log('BUSINESS DETAILS: ', businessInfo)
    console.log('DOCUMENTS: ', businessDocs)
    console.log('USER DETAILS: ', newAdminUser)
  }

  return (
    <div className="flex lg:max-h-[450px] flex-col overflow-y-auto">
      {!isFirstStep && (
        <Button
          aria-label="back"
          color="light"
          className={'absolute -top-14 max-w-fit text-primary lg:-left-[60%]'}
          disabled={isLoading}
          onClick={() => navigateBackwards()}
        >
          <ArrowUturnLeftIcon className="h-5 w-5" /> Back
        </Button>
      )}
      <form
        onSubmit={handleCreateAccount}
        className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4 "
      >
        {error && error.status && (
          <StatusMessage error={error.status} message={error.message} />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTabIndex}
            variants={staggerContainerVariants}
            initial={'hidden'}
            animate={'show'}
            exit={'exit'}
            transition={{ duration: 0.5 }}
            className="flex w-full flex-col items-center justify-center gap-y-4"
          >
            {activeTab}
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex w-full gap-4">
          <Button
            type={'submit'}
            size="lg"
            color="primary"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full max-w-sm "
          >
            {isFirstStep
              ? 'Get Started'
              : !isLastStep
                ? 'Next'
                : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>
  )
}

//BUSINESS REGISTRATION STATUS
function Step0({ updateDetails }) {
  return (
    <>
      <RadioGroup
        label="What type of business do you run?"
        className="flex w-full"
        description=" Payboss gives you the tools to simplify money management and take control of your financial operations - no matter your business size or structure."
        defaultValue={'REGISTERED_BUSINESS'}
        onChange={(e) =>
          updateDetails(STEPS[0], {
            business_registration_status: e.target.value,
          })
        }
      >
        <motion.div
          key={'step-0-1'}
          className="my-2 w-full"
          variants={staggerContainerItemVariants}
        >
          <CustomRadioButton
            description="Works for Sole Proprietors, Limited Liability Companies, and Non-Profit Organizations."
            value="REGISTERED_BUSINESS"
          >
            <p className="mb-1 font-semibold">Registered Business</p>
          </CustomRadioButton>
        </motion.div>

        <motion.div
          className="w-full"
          key={'step-0-2'}
          variants={staggerContainerItemVariants}
        >
          <CustomRadioButton
            description="Works for individuals, one-person business, social media vendors and stores"
            value="UNREGISTERED_BUSINESS"
            disabled={true}
          >
            <p className="mb-1 font-semibold">Unregistered Business</p>
          </CustomRadioButton>
        </motion.div>
      </RadioGroup>
    </>
  )
}

// BUSINESS DETAILS AND OTHER INFORMATION
function Step1({ updateDetails }) {
  const { configOptions } = useConfigStore()

  const companyTypes = configOptions?.companyTypes

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 px-2">
      <h3 className="self-start text-lg font-semibold leading-6 tracking-tight text-neutral-700">
        Business Details
      </h3>
      <motion.div
        key={'step-1-2'}
        className="w-full"
        variants={staggerContainerItemVariants}
      >
        <Input
          type="text"
          label="Business Name"
          name="businessName"
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
          // required={true}
          onChange={(e) => {
            console.log(e.target.value)

            updateDetails(STEPS[0], { companyTypeID: e.target.value })
          }}
        />
        <Input
          type="number"
          label="TPIN"
          name="tpin"
          onChange={(e) => {
            updateDetails(STEPS[0], { tpin: e.target.value })
          }}
        />
      </motion.div>

      <motion.div
        key={'step-1-3'}
        className="w-full"
        variants={staggerContainerItemVariants}
      >
        <DateSelectField
          label={'Date of Incorporation'}
          className="max-w-sm"
          description={'Date the company was registered'}
          labelPlacement={'outside'}
          onChange={(date) => {
            updateDetails(STEPS[0], { date_of_incorporation: formatDate(date) })
          }}
        />
      </motion.div>

      <motion.div
        key={'step-1-1'}
        variants={staggerContainerItemVariants}
        className="flex w-full gap-4"
      >
        <Input
          label="Physical Address"
          name="physical_address"
          // required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { physical_address: e.target.value })
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
          label="Phone"
          name="businessPhone"
          // required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { contact: e.target.value })
          }}
        />
        <Input
          // TODO: REGEX FOR WEBSITE TEST
          label="Website"
          name="website"
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
          // required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { company_email: e.target.value })
          }}
        />
      </motion.div>
    </div>
  )
}

// BUSINESS BANKING DETAILS
function Step2({ updateDetails }) {
  const { configOptions } = useConfigStore()
  const banks = configOptions?.banks
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
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { branch_name: e.target.value })
          }}
        />
        <Input
          label="Branch Code"
          name="branch_code"
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

// BUSINESS DOCUMENTS AND ATTACHMENTS
function Step3({ updateDetails }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <UploadField
        label={'Business Incorporation Certificate'}
        handleFile={(file) => {
          // console.log('ON CHANGE SHOW FILE NAME:', file.name)
          updateDetails(STEPS[3], { incorporationCertificate: file })
        }}
      />
      <UploadField
        label={'Compliance Certificate'}
        handleFile={(file) => {
          // console.log('ON CHANGE SHOW FILE NAME:', file.name)
          updateDetails(STEPS[3], { incorporationCertificate: file })
        }}
      />
      <UploadField
        label={'Compliance Certificate'}
        handleFile={(file) => {
          // console.log('ON CHANGE SHOW FILE NAME:', file.name)
          updateDetails(STEPS[3], { incorporationCertificate: file })
        }}
      />
      <UploadField
        label={'Compliance Certificate'}
        handleFile={(file) => {
          // console.log('ON CHANGE SHOW FILE NAME:', file.name)
          updateDetails(STEPS[3], { incorporationCertificate: file })
        }}
      />
    </div>
  )
}

// CREATE NEW ADMIN USER
function Step4({ key, updateDetails }) {
  const {
    businessInfo,
    newAdminUser,
    businessDocs,
    error,
    updateErrorStatus,
    setBusinessInfo,
    setNewAdminUser,
    setBusinessDocs,
    isLoading,
    setError,
  } = useAuthStore()
  const userRoles = useConfigStore((state) => state.userRoles)

  const ADMIN_ROLE =
    userRoles.find((item) => item.role == 'Admin')?.ID || userRoles[0]?.ID

  useEffect(() => {
    // Clean out any errors if the user makes any changes to the form
    setError({})
  }, [newAdminUser])

  useEffect(() => {
    updateDetails(STEPS[4], { roleID: ADMIN_ROLE })
  }, [])

  return (
    <>
      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <SelectField
          options={userRoles}
          placeholder={'ADMIN USER'}
          name="user_role"
          label="User Role"
          isDisabled={true}
          value={ADMIN_ROLE}
          defaultValue={ADMIN_ROLE}
          listItemName={'role'}
        />
      </motion.div>
      <motion.div
        variants={staggerContainerItemVariants}
        className="flex w-full gap-4"
      >
        <Input
          type="text"
          label="First Name"
          name="firstName"
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[4], { first_name: e.target.value })
          }}
        />
        <Input
          type="text"
          label="Last Name"
          name="lastName"
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[4], { last_name: e.target.value })
          }}
        />
      </motion.div>

      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <Input
          type="text"
          label="Username"
          name="username"
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[4], { username: e.target.value })
          }}
        />
      </motion.div>

      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <Input
          type="number"
          label="Mobile Number"
          name="phone_number"
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[4], { phone_number: e.target.value })
          }}
        />
      </motion.div>

      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <Input
          type="text"
          label="Email"
          name="email"
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[4], { email: e.target.value })
          }}
        />
      </motion.div>
      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <Input
          label="Password"
          type="password"
          name="password"
          onError={error?.onPassword}
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[4], { password: e.target.value })
          }}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must contain at least 8 characters, including uppercase letters, lowercase letters, and numbers"
        />
        {error && error?.onPassword && (
          <motion.span
            whileInView={{
              scale: [0, 1],
              opacity: [0, 1],
              transition: { duration: 0.3 },
            }}
            className="ml-1 text-xs font-semibold text-red-600 "
          >
            {error?.message}
          </motion.span>
        )}
      </motion.div>
      <motion.div className="w-full" variants={staggerContainerItemVariants}>
        <Input
          label="Confirm Password"
          type="password"
          name="password2"
          onError={error?.onPassword}
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[4], { confirmPassword: e.target.value })
          }}
        />
      </motion.div>
    </>
  )
}

function UploadField({ label, handleFile }) {
  return (
    <motion.div
      key={'step-2-1'}
      className="w-full"
      variants={staggerContainerItemVariants}
    >
      <label className="mb-2 text-xs font-medium capitalize text-gray-500 lg:text-[13px]">
        {label}
      </label>
      <FileDropZone
        isLandscape
        className={'min-h-12 p-2'}
        otherAcceptedFiles={{
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            [],
          'application/pdf': [],
          'application/msword': [],
        }}
        onChange={(file) => handleFile(file)}
      />
    </motion.div>
  )
}
