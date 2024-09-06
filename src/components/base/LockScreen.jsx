'use client'
import React, { useEffect } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react'

import { Button } from '../ui/Button'
import { useQueryClient } from '@tanstack/react-query'
import useAuthStore from '@/context/authStore'
import { notify } from '@/lib/utils'
import { getRefreshToken } from '@/app/_actions/auth-actions'

export default function LockScreen({ open }) {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isLoading, setIsLoading } = useAuthStore()

  async function handleRefreshAuthToken() {
    setIsLoading(true)

    // Send New password details to the backend
    const res = await getRefreshToken()

    // If password change success - invalidate query caches - close modals and notify user
    if (res.success) {
      onClose()
      // queryClient.invalidateQueries()
      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }

  useEffect(() => {
    onOpen()
  }, [onOpen])

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
              Screen Lock
              <p className="text-sm font-medium italic leading-6 text-slate-700">
                Are you still there?
              </p>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-y-2">
              <p className="text-center text-sm font-medium italic leading-6 text-primary-800">
                Your new password needs to contain at least 8 characters which
                contains at least one uppercase, lowercase and symbol.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                isDisabled={isLoading}
                className="mt-4"
              >
                Log out
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                onPress={handleRefreshAuthToken}
                className="mt-4"
              >
                Am still here
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
