'use client'
import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react'

import { Button } from '../ui/Button'
import { Input } from '../ui/InputField'
import { PASSWORD_PATTERN, SETUP_QUERY_KEY } from '@/lib/constants'
import { useQueryClient } from '@tanstack/react-query'
import useAuthStore from '@/context/authStore'
import { StatusMessage } from '.'
import { changeUserPassword } from '@/app/_actions/user-actions'
import { notify } from '@/lib/utils'

export default function FirstLogin({ open }) {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    error,
    setError,
    isLoading,
    setIsLoading,
    password,
    updatePasswordField,
  } = useAuthStore()

  async function handlePasswordChange() {
    setIsLoading(true)
    console.log(PASSWORD_PATTERN.test(password.newPassword))

    if (
      password.confirmPassword.length < 8 ||
      !PASSWORD_PATTERN.test(password.newPassword)
    ) {
      notify('error', 'Operation Failed! Try again')
      setIsLoading(false)
      setError({
        status: true,
        onConfirmPassword: true,
        message:
          'Passwords needs to contain at least 8 characters (consisting of lowercase, uppercase, symbols) and have no spaces',
      })
      return
    }

    // Send New password details to the backend
    const res = await changeUserPassword(password.confirmPassword)

    // If password change success - invalidate query caches - close modals and notify user
    if (res.success) {
      onClose()
      notify('success', res.message || 'Password Changed Successfully')
      queryClient.invalidateQueries()
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    notify('error', res.message || 'Operation Failed! Try again')
  }

  useEffect(() => {
    onOpen()
  }, [onOpen])

  useEffect(() => {
    setError({ message: '', status: false })
  }, [password])

  return (
    <Modal
      backdrop="blur"
      isOpen={open || isOpen}
      onClose={onClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change Your Password
              <p className="text-sm font-medium italic leading-6 text-slate-700">
                Your login was successful. As a security measure, we require all
                users to change their password on their first login.
              </p>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-y-2">
              <Input
                label="Password"
                type="password"
                autoFocus
                value={password.newPassword}
                required
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                onChange={(e) =>
                  updatePasswordField({ newPassword: e.target.value })
                }
              />
              <Input
                label="Confirm Password"
                type="password"
                value={password.confirmPassword}
                onChange={(e) =>
                  updatePasswordField({ confirmPassword: e.target.value })
                }
                onError={
                  (password.confirmPassword !== password.newPassword &&
                    password?.confirmPassword.length > 6) ||
                  error?.onConfirmPassword
                }
                errorText={'Passwords do not match'}
              />
              {error.status && (
                <div className="mx-auto mt-2 flex w-full flex-col items-center justify-center gap-4">
                  <StatusMessage error={error.status} message={error.message} />
                </div>
              )}
              <Button
                isLoading={isLoading}
                isDisabled={
                  !password || password?.newPassword.length < 8 || isLoading
                }
                onPress={handlePasswordChange}
                className="mt-4"
              >
                Change Password
              </Button>
            </ModalBody>
            <ModalFooter>
              <p className="text-center text-sm font-medium italic leading-6 text-primary-800">
                Your new password needs to contain at least 8 characters which
                contains at least one uppercase, lowercase and symbol.
              </p>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
