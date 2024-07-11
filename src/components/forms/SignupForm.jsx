'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { Spinner, RadioGroup } from '@nextui-org/react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import useCustomTabsHook from '@/hooks/CustomTabsHook'
import { CustomRadioButton, StatusMessage } from '../base'
import { Button } from '../ui/Button'
import {
  staggerContainerItemVariants,
  staggerContainerVariants,
} from '@/lib/constants'
import { ArrowUturnLeftIcon, BackwardIcon } from '@heroicons/react/24/outline'

export default function SignUpForm() {
  const { push } = useRouter()
  const [error, setError] = useState({})
  const [newUser, setNewUser] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  function updateErrorStatus(fields) {
    setError({ ...error, ...fields })
  }
  function updateUserDetails(fields) {
    setNewUser({ ...newUser, ...fields })
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
    <Step1 key="personal-info" updateUserDetails={updateUserDetails} />,
    <Step2 key={'business-info'} updateUserDetails={updateUserDetails} />,
    <Step3 key={'password-info'} updateUserDetails={updateUserDetails} />,
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

    console.log('SIGN UP DETAILS: ', newUser)
  }

  useEffect(() => {
    updateUserDetails({ role: 'USER' })
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

function Step1({ updateUserDetails }) {
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
            updateUserDetails({ firstName: e.target.value })
          }}
        />
        <Input
          type="text"
          label="Last Name"
          name="lastName"
          required={true}
          onChange={(e) => {
            updateUserDetails({ lastName: e.target.value })
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
          name="username"
          required={true}
          onChange={(e) => {
            updateUserDetails({ username: e.target.value })
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
            updateUserDetails({ email: e.target.value })
          }}
        />
      </motion.div>
    </>
  )
}

function Step2({ updateUserDetails }) {
  return (
    <>
      <RadioGroup
        label="What best describes you?"
        className="flex w-full"
        description="This will help us to provide you better service."
        defaultValue={'REGISTERED_BUSINESS'}
        onChange={(e) => updateUserDetails({ role: e.target.value })}
      >
        <motion.div
          key={'step-2-1'}
          className="w-full"
          variants={staggerContainerItemVariants}
        >
          <CustomRadioButton
            description="Designed for any registered business, including Sole Proprietors, Limited Liability Companies, and Non-Profit Organizations."
            value="REGISTERED_BUSINESS"
          >
            <p className="mb-1 font-semibold">Registered Business</p>
          </CustomRadioButton>
        </motion.div>

        <motion.div
          className="w-full"
          key={'step-2-2'}
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

function Step3({ key, updateUserDetails }) {
  return (
    <>
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
            updateUserDetails({ password: e.target.value })
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
            updateUserDetails({ confirmPassword: e.target.value })
          }}
        />
      </motion.div>
    </>
  )
}
