'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/InputField'
import Spinner from '@/components/ui/Spinner'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

export default function PasswordReset() {
  const urlParams = useSearchParams()
  const role = urlParams.get('role')
  0
  const [passwordReset, setPasswordReset] =
    useState <
    ResetDetail >
    {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    }

  function updatePasswordResetFields(fields) {
    setPasswordReset({ ...passwordReset, ...fields })
  }

  const {
    currentTabIndex,
    activeTab,
    navigateTo,
    navigateForward,
    navigateBackwards,
    isLoading,
    setIsLoading,
  } = useCustomTabsHook([
    <ResetMyPassword
      key={'reset-password'}
      handleRequest6DigitCode={handleRequest6DigitCode}
      passwordReset={passwordReset}
      updatePasswordResetFields={updatePasswordResetFields}
    />,
    <ValidatePassCode
      key={'validate-code'}
      handleValidatePassCode={handleValidatePassCode}
      passwordReset={passwordReset}
      updatePasswordResetFields={updatePasswordResetFields}
    />,
    <CreateNewPassword
      key={'new-password'}
      handleCreateNewPassword={handleCreateNewPassword}
      passwordReset={passwordReset}
      updatePasswordResetFields={updatePasswordResetFields}
    />,
    <Success key={'success'} />,
  ])

  async function handleRequest6DigitCode() {
    setIsLoading(true)
    navigateForward()
    setIsLoading(false)
  }

  async function handleValidatePassCode() {
    setIsLoading(true)
    navigateForward()
    setIsLoading(false)
  }

  async function handleCreateNewPassword() {
    setIsLoading(true)
    navigateBackwards()
    setIsLoading(false)
  }

  return (
    <div className="my-12 flex h-full flex-col items-center gap-4 p-12 lg:justify-center">
      <div className="md:w-3/4 lg:w-4/5">
        <div className="">
          <span
            className={
              'flex font-inter text-[15px] font-medium leading-6 text-primary'
            }
          >
            LOST ACCESS TO YOUR ACCOUNT?
          </span>
          <h2
            className={`my-1 font-inter text-2xl font-bold leading-8 text-slate-800 md:text-3xl`}
          >
            Account Password Reset
          </h2>
        </div>
        <AnimatePresence mode="sync">
          <motion.div
            key={currentTabIndex}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex max-w-sm flex-col gap-4"
          >
            {isLoading ? (
              <div className="my-10 flex items-center justify-center">
                <Spinner size={48} />
              </div>
            ) : (
              activeTab
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ResetMyPassword({
  handleRequest6DigitCode,
  updatePasswordResetFields,
  passwordReset,
}) {
  return (
    <>
      <p className="-mt-5 text-sm leading-6 tracking-tight text-slate-500 xl:text-base">
        An email with a 6-Digit pass code will sent to the email address.
        Provide the code in the next step for verification.
      </p>

      <Input
        required
        label={'Email Address'}
        type={'email'}
        name={'email'}
        onChange={(e) =>
          updatePasswordResetFields({
            email: e.target.value,
          })
        }
      />
      <Button
        className={'w-full'}
        size="lg"
        color="primary"
        disabled={!passwordReset?.email.includes('@')}
        onClick={handleRequest6DigitCode}
      >
        Request Code
      </Button>
    </>
  )
}

function ValidatePassCode({
  handleValidatePassCode,
  updatePasswordResetFields,
  passwordReset,
}) {
  return (
    <>
      <p className="-mt-5 text-sm leading-5 tracking-tight text-slate-500 xl:text-base">
        An email with a 6-Digit pass code was sent to the email address you
        provided to verify that the account belongs to you.
      </p>
      {/* OTP FIELD */}
      <Input
        label={'OTP'}
        type="text"
        value={passwordReset?.otp}
        onChange={(e) =>
          updatePasswordResetFields({
            otp: e.target.value,
          })
        }
        name={'Pass-code'}
      />
      <Button
        className={'w-full'}
        size="lg"
        color="primary"
        disabled={passwordReset?.otp.length < 6}
        onClick={() => {
          if (passwordReset?.otp.length < 6) {
            return
          } else {
            handleValidatePassCode()
          }
        }}
      >
        Verify Code
      </Button>
    </>
  )
}

function CreateNewPassword({
  handleCreateNewPassword,
  updatePasswordResetFields,
  passwordReset,
}) {
  const [confirmPassword, setConfirmPassword] = useState('')
  return (
    <>
      <p className="-mt-5 text-sm leading-5 tracking-tight text-slate-500 xl:text-base">
        Create a new password that you don&apos;t use on any other accounts.
        Make sure its secure and safe.
      </p>
      {/* Create Password */}
      <Input
        label={'New Password'}
        value={passwordReset.password}
        onChange={(e) =>
          updatePasswordResetFields({
            password: e.target.value,
            otp: '',
          })
        }
        name={'password'}
        type={'password'}
      />
      {/* Confirm Password */}

      <Input
        label={'Confirm Password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        name={'confirmPassword'}
        type={'password'}
      />
      {/* ERROR MESSAGE */}
      {passwordReset.password !== confirmPassword &&
        passwordReset?.password &&
        passwordReset?.password.length > 4 && (
          <span className="text-xs text-red-600">Passwords do not match</span>
        )}
      {/* Previous and Next Page Buttons */}
      <Button
        className={'w-full'}
        size="lg"
        color="primary"
        disabled={
          passwordReset.password !== confirmPassword ||
          passwordReset.password.length <= 4
        }
        onClick={() => {
          if (passwordReset.password !== confirmPassword) {
            return
          } else {
            handleCreateNewPassword()
          }
        }}
      >
        Reset Password
      </Button>
    </>
  )
}

function Success({}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        <p className="-mt-5 mb-5 text-sm leading-5 tracking-tight text-slate-500 xl:text-base">
          Your password has been successfully reset. You can now login with the
          new password you just created!
        </p>

        <div className="grid w-full gap-4">
          <Button as={Link} href={'/login'} className={'w-full flex-1'}>
            Login
          </Button>
        </div>
      </div>
    </>
  )
}
