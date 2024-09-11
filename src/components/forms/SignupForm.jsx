'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { StatusMessage } from '../base'
import { Button } from '../ui/Button'
import { containerVariants } from '@/lib/constants'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { notify } from '@/lib/utils'
import useAuthStore from '@/context/authStore'
import Step0 from './signup-fragments/Step0'
import Step1 from './signup-fragments/Step1'
import Step2 from './signup-fragments/Step2'
import Step3 from './signup-fragments/Step3'
import {
  createMerchantAdminUser,
  createNewMerchant,
  submitMerchantBankDetails,
  updateMerchantDetails,
} from '@/app/_actions/auth-actions'
import { Card } from '@nextui-org/react'
import Step1_TPIN from './signup-fragments/Step1_1'

export const STEPS = [
  'business-registration',
  'business-information',
  'business-bank-details',
  'user-information',
]

export default function SignUpForm() {
  const { push } = useRouter()

  const {
    businessInfo,
    newAdminUser,
    error,
    updateErrorStatus,
    setBusinessInfo,
    setNewAdminUser,
    isLoading,
    setIsLoading,
    setAccountCreated,
    merchantID,
    setMerchantID,
    setError,
    isValidTPIN,
    resetAuthData,
  } = useAuthStore()

  const NEW_REGISTRATION = [
    <Step1
      key={STEPS[1]}
      updateDetails={updateAccountDetails}
      backToStart={handleGotoStart}
    />, // BUSINESS INFO
    <Step2
      key={STEPS[2]}
      updateDetails={updateAccountDetails}
      backToStart={handleGotoStart}
    />, // BANK DETAILS
    <Step3
      key={STEPS[3]}
      updateDetails={updateAccountDetails}
      backToStart={handleGotoStart}
    />, // BUSINESS ADMIN USER
  ]

  const CONTINUE_REGISTRATION = [
    <Step1_TPIN
      key={STEPS[1]}
      updateDetails={updateAccountDetails}
      backToStart={handleGotoStart}
    />, // GET ACCOUNT DETAILS BY TPIN
    <Step2
      key={STEPS[2]}
      updateDetails={updateAccountDetails}
      backToStart={handleGotoStart}
    />, // BANK DETAILS
    <Step3
      key={STEPS[3]}
      updateDetails={updateAccountDetails}
      backToStart={handleGotoStart}
    />,
  ]

  const RENDERED_COMPONENTS =
    businessInfo?.registration != 'NEW'
      ? CONTINUE_REGISTRATION
      : NEW_REGISTRATION

  const {
    activeTab,
    navigateForward,
    navigateBackwards,
    navigateTo,
    currentTabIndex,
    firstTab,
    lastTab,
  } = useCustomTabsHook([
    <Step0 key={STEPS[0]} updateDetails={updateAccountDetails} />, // BUSINESS SPACE TYPE
    ...RENDERED_COMPONENTS,
  ])

  const isLastStep = currentTabIndex === lastTab
  const isFirstStep = currentTabIndex === firstTab

  function handleGotoStart() {
    resetAuthData()
    navigateTo(0)
  }
  function goTo(i) {
    navigateTo(i)
  }

  function updateAccountDetails(step, fields) {
    // BUSINESS INFO
    if (STEPS[0] == step) {
      setBusinessInfo({ ...businessInfo, ...fields })
      return
    }

    // NEW ADMIN USER
    if (STEPS[4] == step) {
      setNewAdminUser({ ...newAdminUser, ...fields })
    }
  }

  async function handleCreateAccount(e) {
    e.preventDefault()
    setIsLoading(true)
    updateErrorStatus({ status: false, message: '' })

    // ******** STEP: 0 ==>  USER CHOOSES TO EITHER CONTINUE OR START A NEW REGISTRATION ********** //
    if (businessInfo.registration == 'CONTINUE' && !isValidTPIN) {
      navigateForward()
      setIsLoading(false)
      return
    }
    // ******************************************************************************************** //

    // ************** STEP: 1 ==>  CONTINUE NEW MERCHANT ACCOUNT CREATION ************************* //
    // IF USER IS CONTINUING REGISTRATION AND HAS PROVIDED A VALID TPIN
    // THEN NAVIGATE THEM TO CORRECT STAGE
    if (
      businessInfo.registration == 'CONTINUE' &&
      currentTabIndex === 1 &&
      isValidTPIN &&
      businessInfo?.stage // EXPECTED TO BE EITHER 2 OR 3
    ) {
      navigateTo(Number(businessInfo?.stage + currentTabIndex)) // INDEX START FROM ZERO
      setIsLoading(false)
      return
    }

    // ******************************************************************************************** //

    // ************** STEP: 1 ==>  CREATE NEW MERCHANT ACCOUNT *********************************** //
    if (
      currentTabIndex === 1 &&
      STEPS[currentTabIndex] === STEPS[1] &&
      !isValidTPIN
    ) {
      const response = await createNewMerchant(businessInfo)

      let merchantID = response?.data?.merchantID

      if (merchantID) {
        setMerchantID(merchantID)
      }

      if (response.success && (response?.data?.merchantID || merchantID)) {
        notify('success', 'Details Submitted For Approval')
        navigateForward()
        setIsLoading(false)
        return
      } else {
        notify('error', 'Error Submitting Business Details')
        updateErrorStatus({ status: true, message: response.message })
        setIsLoading(false)
        return
      }
    }
    // ******************************************************************************************** //

    // ************** STEP: 2 ==>  APPEND MERCHANT ACCOUNT BANK DETAILS *************************** //
    if (
      currentTabIndex === 2 &&
      STEPS[currentTabIndex] === STEPS[2] &&
      !isValidTPIN
    ) {
      const response = await submitMerchantBankDetails(businessInfo, merchantID)

      if (response.success) {
        notify('success', 'Bank information Submitted!')
        navigateForward()
        setIsLoading(false)
        return
      } else {
        notify('error', 'Error Submitting Bank information!')
        updateErrorStatus({ status: true, message: response.message })
        setIsLoading(false)
        return
      }
    }
    // ******************************************************************************************** //

    // ******************** STEP: 3 ==>  CREATE ADMIN USER - LAST STEP *************************** //
    if (isLastStep && STEPS[currentTabIndex] === STEPS[lastTab]) {
      // Passwords Validation
      if (newAdminUser?.password !== newAdminUser?.confirmPassword) {
        updateErrorStatus({
          onPassword: true,
          message: 'Passwords do not match',
        })
        setIsLoading(false)
        return
      }

      let response = await createMerchantAdminUser(newAdminUser, merchantID)

      if (response.success) {
        notify('success', 'Account Created Successfully')
        setAccountCreated(true)
        setIsLoading(false)
        return
      } else {
        notify('error', 'Error Creating Account!')
        updateErrorStatus({ status: true, message: response.message })
        setIsLoading(false)
        return
      }
    }
    // ******************************************************************************************** //

    if (!isLastStep) {
      navigateForward()
      setIsLoading(false)
      return
    }
  }

  useEffect(() => {
    // Clean out any errors if the user makes any changes to the form
    setError({})
  }, [newAdminUser, businessInfo])

  // FOR REGISTRATION

  return (
    <Card className="mx-auto w-full max-w-sm flex-auto p-6 sm:max-w-[790px]">
      <div className="flex flex-col ">
        <form
          onSubmit={handleCreateAccount}
          className="mx-auto flex w-full flex-col items-center justify-center gap-4 "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTabIndex}
              variants={containerVariants}
              initial={'hidden'}
              animate={'show'}
              exit={'exit'}
              transition={{ duration: 0.5 }}
              className="flex w-full flex-col items-center justify-center gap-y-4"
            >
              {activeTab}
            </motion.div>
          </AnimatePresence>

          {error?.status && (
            <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center">
              <StatusMessage error={error.status} message={error.message} />
            </div>
          )}

          <div className="mt-5 flex w-full items-end justify-center gap-4 md:justify-end">
            {/* {!isFirstStep && (
              <Button
                aria-label="back"
                color="light"
                className={
                  'w-full max-w-xs text-primary sm:w-auto sm:max-w-fit'
                }
                disabled={isLoading}
                onClick={() => navigateBackwards()}
              >
                <ArrowUturnLeftIcon className="h-5 w-5" /> Back
              </Button>
            )} */}
            <Button
              type={'submit'}
              size="lg"
              color="primary"
              isLoading={isLoading}
              disabled={
                isLoading ||
                (businessInfo.registration == 'CONTINUE' &&
                  !isValidTPIN &&
                  currentTabIndex === 1)
              }
              className="w-full max-w-xs sm:w-auto"
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
    </Card>
  )
}
