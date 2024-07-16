'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { Spinner, RadioGroup, DatePicker } from '@nextui-org/react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import useCustomTabsHook from '@/hooks/CustomTabsHook'
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

const STEPS = [
  'business-registration',
  'business-information',
  'business-documentation',
  'personal-information',
]

export default function SignUpForm() {
  const { push } = useRouter()
  const [error, setError] = useState({})
  const [businessInfo, setBusinessInfo] = useState({})
  const [businessDocs, setBusinessDocs] = useState({})
  const [newAdminUser, setNewAdminUser] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const {
    data: configs,

    isSuccess,
  } = useGeneralConfigOptions()

  function updateErrorStatus(fields) {
    setError({ ...error, ...fields })
  }

  function updateAccountDetails(step, fields) {
    if (STEPS[0] == step) {
      setBusinessInfo({ ...businessInfo, ...fields })
    }

    if (STEPS[1] == step) {
      businessDocs({ ...businessDocs, ...fields })
    }

    if (STEPS[2] == step) {
      newAdminUser({ ...newAdminUser, ...fields })
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
    <Step3 key={STEPS[3]} updateDetails={updateAccountDetails} />,
    <Step0 key={STEPS[0]} updateDetails={updateAccountDetails} />,
    <Step1 key={STEPS[1]} updateDetails={updateAccountDetails} />,
    <Step2 key={STEPS[2]} updateDetails={updateAccountDetails} />,
    <Step4 key={STEPS[4]} updateDetails={updateAccountDetails} />,
  ])

  const isLastStep = currentTabIndex === lastTab
  const isFirstStep = currentTabIndex === firstTab

  async function handleCreateAccount(e) {
    e.preventDefault()
    setIsLoading(true)
    updateErrorStatus({ status: false, message: '' })

    if (!isLastStep) {
      navigateForward()
      setIsLoading(false)
      return
    }

    if (newUser?.password !== newUser?.confirmPassword) {
      updateErrorStatus({ status: true, message: 'Passwords do not match' })
      setIsLoading(false)
      setTimeout(() => {
        setError({
          message: '',
          status: false,
        })
      }, 5000)
      return
    }

    console.log('BUSINESS DETAILS: ', businessInfo)
    console.log('DOCUMENTS: ', businessDocs)
    console.log('USER DETAILS: ', newAdminUser)
  }

  return (
    <div className="flex max-h-[420px] flex-col overflow-y-auto">
      {!isFirstStep && (
        <Button
          aria-label="back"
          color="light"
          className={'absolute -top-20 max-w-fit text-primary lg:-left-[60%]'}
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
            businessRegistrationStatus: e.target.value,
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
          >
            <p className="mb-1 font-semibold">Unregistered Business</p>
          </CustomRadioButton>
        </motion.div>
      </RadioGroup>
    </>
  )
}

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
          required={true}
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
          required={true}
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
          required={true}
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
          required={true}
          onChange={(e) => {
            updateDetails({ company_email: e.target.value })
          }}
        />
      </motion.div>
    </div>
  )
}

function Step2({ updateDetails }) {
  const { configOptions } = useConfigStore()
  const banks = configOptions?.banks
  return (
    <>
      <h3 className="self-start text-lg font-semibold leading-6 tracking-tight text-neutral-700">
        Banking Details
      </h3>
      <motion.div
        key={'step-1-3'}
        className="w-full"
        variants={staggerContainerItemVariants}
      >
        <SelectField
          options={configOptions?.banks}
          label="Bank"
          name="bankID"
          listItemName={'bank_name'}
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { bankID: e.target.value })
          }}
        />
      </motion.div>

      <motion.div
        key={'step-1-3'}
        className="w-full"
        variants={staggerContainerItemVariants}
      >
        <Input
          label="Account Name"
          name="account_name"
          required={true}
          onChange={(e) => {
            updateDetails({ account_name: e.target.value })
          }}
        />
      </motion.div>

      <motion.div
        key={'step-1-3'}
        className="w-full"
        variants={staggerContainerItemVariants}
      >
        <Input
          label="Branch Name"
          name="branch_name"
          required={true}
          onChange={(e) => {
            updateDetails({ branch_name: e.target.value })
          }}
        />
        <Input
          label="Branch Code"
          name="branch_code"
          required={true}
          onChange={(e) => {
            updateDetails({ branch_code: e.target.value })
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
            updateDetails({ account_number: e.target.value })
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

function Step3({ updateDetails }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <UploadField
        label={'Business Incorporation Certificate'}
        handleFile={(file) => {
          // console.log('ON CHANGE SHOW FILE NAME:', file.name)
          updateDetails({ incorporationCertificate: file })
        }}
      />
      <UploadField
        label={'Compliance Certificate'}
        handleFile={(file) => {
          // console.log('ON CHANGE SHOW FILE NAME:', file.name)
          updateDetails({ incorporationCertificate: file })
        }}
      />
      <UploadField
        label={'Compliance Certificate'}
        handleFile={(file) => {
          // console.log('ON CHANGE SHOW FILE NAME:', file.name)
          updateDetails({ incorporationCertificate: file })
        }}
      />
      <UploadField
        label={'Compliance Certificate'}
        handleFile={(file) => {
          // console.log('ON CHANGE SHOW FILE NAME:', file.name)
          updateDetails({ incorporationCertificate: file })
        }}
      />
    </div>
  )
}

function Step4({ key, updateDetails }) {
  return (
    <>
      <motion.div
        key={'step-1-1'}
        variants={staggerContainerItemVariants}
        className="flex w-full gap-4"
      >
        <Input
          type="text"
          label="First Name"
          name="firstName"
          required={true}
          onChange={(e) => {
            updateDetails({ firstName: e.target.value })
          }}
        />
        <Input
          type="text"
          label="Last Name"
          name="lastName"
          required={true}
          onChange={(e) => {
            updateDetails({ lastName: e.target.value })
          }}
        />
      </motion.div>

      <motion.div
        key={'step-1-2'}
        className="w-full"
        variants={staggerContainerItemVariants}
      >
        <Input
          type="text"
          label="Mobile Number"
          name="mobileNo"
          required={true}
          onChange={(e) => {
            updateDetails({ mobileNo: e.target.value })
          }}
        />
      </motion.div>

      <motion.div
        key={'step-1-3'}
        className="w-full"
        variants={staggerContainerItemVariants}
      >
        <Input
          type="text"
          label="Email"
          name="email"
          required={true}
          onChange={(e) => {
            updateDetails({ email: e.target.value })
          }}
        />
      </motion.div>
      <motion.div
        key={'step-3-1'}
        className="w-full"
        variants={staggerContainerItemVariants}
      >
        <Input
          label="Password"
          type="password"
          name="password"
          required={true}
          onChange={(e) => {
            updateDetails({ password: e.target.value })
          }}
        />
      </motion.div>
      <motion.div
        key={'step-3-1'}
        className="w-full"
        variants={staggerContainerItemVariants}
      >
        <Input
          label="Confirm Password"
          type="password"
          name="password2"
          required={true}
          onChange={(e) => {
            updateDetails({ confirmPassword: e.target.value })
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
