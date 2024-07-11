'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { Spinner, RadioGroup } from '@nextui-org/react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import useCustomTabsHook from '@/hooks/CustomTabsHook'
import { CustomRadioButton, FileDropZone, StatusMessage } from '../base'
import { Button } from '../ui/Button'
import {
  staggerContainerItemVariants,
  staggerContainerVariants,
} from '@/lib/constants'
import { ArrowUturnLeftIcon, BackwardIcon } from '@heroicons/react/24/outline'

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
    <Step0 key={STEPS[0]} updateDetails={updateAccountDetails} />,
    <Step1 key={STEPS[1]} updateDetails={updateAccountDetails} />,
    <Step2 key={STEPS[2]} updateDetails={updateAccountDetails} />,
    <Step3 key={STEPS[4]} updateDetails={updateAccountDetails} />,
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

  useEffect(() => {
    // updateDetails({ role: 'USER' })
  }, [])

  return (
    <div className="flex flex-col">
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
        className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4"
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
          className="w-full"
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
  return (
    <>
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
            updateDetails(STEPS[0], { businessName: e.target.value })
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
          label="Business Phone"
          name="businessPhone"
          required={true}
          onChange={(e) => {
            updateDetails(STEPS[0], { businessPhone: e.target.value })
          }}
        />
        <Input
          type="number"
          label="Business Tel"
          name="businessLandLine"
          onChange={(e) => {
            updateDetails(STEPS[0], { businessLandLine: e.target.value })
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
          label="Business Email"
          name="businessEmail"
          required={true}
          onChange={(e) => {
            updateDetails({ businessEmail: e.target.value })
          }}
        />
      </motion.div>
    </>
  )
}

function Step2({ updateDetails }) {
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
    </div>
  )
}

function Step3({ key, updateDetails }) {
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
