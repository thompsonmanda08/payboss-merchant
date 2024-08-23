import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal'
import { Button } from '../ui/Button'

function PromptModal({
  size = 'lg',
  isOpen,
  onClose,
  onConfirm,
  title = 'Prompt',
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  isDisabled,
  isLoading,
  isDismissable = true,
  isKeyboardDismissDisabled = true,
  children,
}) {
  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={'z-[99999999]'}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                {cancelText}
              </Button>
              <Button
                color="primary"
                isDisabled={isDisabled}
                isLoading={isLoading}
                onPress={onConfirm}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default PromptModal
