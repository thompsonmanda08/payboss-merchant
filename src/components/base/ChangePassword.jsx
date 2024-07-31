'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { notify } from '@/lib/utils'
import { Input } from '../ui/InputField'
import { Button } from '../ui/Button'
import { PASSWORD_PATTERN } from '@/lib/constants'

function ChangePasswordField({ updatePassword, setUpdatePassword }) {
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({ status: '', message: '' })
  const [passwordFields, setPasswordField] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  function updatePasswordField(fields) {
    setPasswordField({ ...passwordFields, ...fields })
  }

  function resetPasswordFields() {
    setPasswordField({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  async function handleChangePassword() {
    setLoading(true)

    if (!passwordFields.currentPassword) {
      setError({
        noPassword: true,
        message: 'Provide your current password!',
      })
      setLoading(false)
      return
    }

    if (PASSWORD_PATTERN.match(passwordFields.newPassword)) {
      setError({
        status: true,
        message: 'Passwords should match the policy on the left',
      })
      setLoading(false)
      return
    }

    if (passwordFields.confirmPassword != passwordFields.newPassword) {
      setError({
        status: true,
        noMatch: true,
        message: 'Passwords do not match',
      })
      setLoading(false)
      return
    }

    setTimeout(() => {
      notify('success', 'Password Changed Successfully!')
      setLoading(false)
      setUpdatePassword(false)
      resetPasswordFields()
    }, 3000)
  }

  useEffect(() => {
    setError({})
  }, [passwordFields])

  return (
    updatePassword && (
      <AnimatePresence mode="wait">
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: -100,
              transition: {
                duration: 0.5,
                ease: 'easeInOut',
              },
            },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeInOut',
              },
            },
          }}
          initial={'hidden'}
          animate={'visible'}
          exit={'hidden'}
          className="flex w-full gap-4 py-4"
        >
          <div className="flex w-full flex-col gap-3">
            <Input
              id="old_password"
              label="Current Password"
              placeholder="Enter current password"
              type="password"
              onError={error?.noPassword}
              errorText={error.message}
              value={passwordFields.currentPassword}
              onChange={(e) =>
                updatePasswordField({ currentPassword: e.target.value })
              }
            />
            {/* ERROR MESSAGE */}
            {passwordFields.currentPassword && passwordFields.newPassword && (
              <AnimatePresence>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 100 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex justify-start"
                >
                  <ul className="-mt-1 flex list-disc flex-col pl-8 text-[10px] tracking-tight text-slate-700 sm:text-xs xl:text-sm">
                    <li>Your New Password must have at least 8 characters</li>
                    <li>Must contain at least 8 characters</li>
                    <li>Must include uppercase letters</li>
                    <li>Must include lowercase letters</li>
                    <li>Must include a number & symbols</li>
                  </ul>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <Input
              id="new_password"
              label="New Password"
              placeholder="Enter new password"
              type="password"
              onError={error.status}
              value={passwordFields.newPassword}
              onChange={(e) =>
                updatePasswordField({ newPassword: e.target.value })
              }
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Your password must include letters numbers and symbols!"
            />
            <Input
              id="confirm_password"
              label="Confirm Password"
              placeholder="Confirm new password"
              type="password"
              value={passwordFields.confirmPassword}
              onError={
                passwordFields.confirmPassword.length > 6 &&
                error.status &&
                error?.noMatch
              }
              errorText={error.message}
              onChange={(e) =>
                updatePasswordField({ confirmPassword: e.target.value })
              }
            />

            <div className="mt-2 flex justify-end gap-2">
              <Button
                size="sm"
                className="h-10 px-6 text-sm"
                color="danger"
                disabled={loading}
                onClick={async () => setUpdatePassword(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-10 px-8 text-sm"
                isLoading={loading}
                disabled={loading || isValidPassword}
                onClick={async () => await handleChangePassword()}
              >
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  )
}

export default ChangePasswordField
